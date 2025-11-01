# tRPC 实现指南

## 概述

tRPC 是一个用于构建类型安全 API 的全栈 TypeScript 库。本指南基于 Noteum 项目的实际技术栈，展示如何在 NestJS + React + TanStack Router + Zustand + Prisma 的架构中实现 tRPC。

## 项目技术栈

### 后端
- **框架**: NestJS 10.x LTS
- **运行时**: Node.js 18+
- **数据库**: PostgreSQL 15+ with Prisma 5.0+
- **缓存**: Redis 4.6+ with Redis Streams
- **AI 集成**: LangChain.js + LangGraph

### 前端
- **框架**: React 18.2+
- **路由**: TanStack Router
- **状态管理**: Zustand
- **UI 库**: shadcn/ui
- **构建工具**: Vite 4.5+
- **TypeScript**: 5.0+

### tRPC 版本
- **tRPC**: v10.45.0
- **@tanstack/react-query**: v4.x
- **包名**: `@trpc/react-query`

## 项目结构 (Monorepo)

```
noteum/
├── apps/
│   ├── client/                 # React 前端应用
│   └── services/               # NestJS 后端服务
├── packages/
│   └── utils/                  # 共享工具库
├── docs/
│   └── trpc-implementation-guide.md
└── package.json
```

## 1. NestJS 后端实现

### 1.1 基础配置

```typescript
// apps/services/src/trpc/trpc.module.ts
import { Module } from '@nestjs/common';
import { TrpcModule } from './trpc.module';
import { NotesModule } from '../notes/notes.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TrpcModule,
    NotesModule,
    AuthModule,
  ],
})
export class AppModule {}
```

```typescript
// apps/services/src/trpc/trpc.service.ts
import { Injectable } from '@nestjs/common';
import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import { Context } from './trpc.context';

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

@Injectable()
export class TrpcService {
  router = router;
  publicProcedure = publicProcedure;
  protectedProcedure = protectedProcedure;
}
```

```typescript
// apps/services/src/trpc/trpc.context.ts
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

export interface Context {
  user?: {
    id: string;
    email: string;
  };
  prisma: PrismaService;
  redis: RedisService;
  req?: Request;
  res?: Response;
}

export type ContextFactory = (opts: { req: Request; res: Response }) => Promise<Context>;

export const createContext: ContextFactory = async ({ req, res }) => {
  // 从请求头中提取认证信息
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  let user;
  if (token) {
    // 验证 JWT token 并获取用户信息
    user = await verifyToken(token);
  }

  return {
    user,
    prisma: new PrismaService(),
    redis: new RedisService(),
    req,
    res,
  };
};
```

### 1.2 笔记路由实现

```typescript
// apps/services/src/notes/notes.router.ts
import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc/trpc.service';
import { NotesService } from './notes.service';
import { AiProcessingService } from '../ai/ai-processing.service';

const CreateNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

const UpdateNoteSchema = CreateNoteSchema.partial().extend({
  id: z.string().uuid(),
});

const GetNotesSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const notesRouter = router({
  // 获取笔记列表
  list: protectedProcedure
    .input(GetNotesSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.note.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.search && {
            OR: [
              { title: { contains: input.search, mode: 'insensitive' } },
              { content: { contains: input.search, mode: 'insensitive' } },
            ],
          }),
          ...(input.tags && input.tags.length > 0 && {
            tags: { hasSome: input.tags },
          }),
        },
        orderBy: { updatedAt: 'desc' },
        take: input.limit,
        skip: input.offset,
        include: {
          tags: true,
          _count: { select: { childNotes: true } },
        },
      });
    }),

  // 获取单个笔记
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const note = await ctx.prisma.note.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        include: {
          tags: true,
          childNotes: true,
          parentNote: true,
        },
      });

      if (!note) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '笔记不存在',
        });
      }

      return note;
    }),

  // 创建笔记
  create: protectedProcedure
    .input(CreateNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const note = await ctx.prisma.note.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
        include: {
          tags: true,
        },
      });

      return note;
    }),

  // 更新笔记
  update: protectedProcedure
    .input(UpdateNoteSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      // 检查笔记是否存在且属于当前用户
      const existingNote = await ctx.prisma.note.findFirst({
        where: { id, userId: ctx.user.id },
      });

      if (!existingNote) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '笔记不存在',
        });
      }

      const updatedNote = await ctx.prisma.note.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          tags: true,
        },
      });

      return updatedNote;
    }),

  // 删除笔记
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const note = await ctx.prisma.note.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!note) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '笔记不存在',
        });
      }

      await ctx.prisma.note.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // 提交 AI 处理请求
  submitAiProcessing: protectedProcedure
    .input(z.object({
      noteId: z.string().uuid(),
      processingOptions: z.object({
        type: z.enum(['SUMMARIZE', 'EXTRACT_INSIGHTS', 'GENERATE_RELATED']),
        model: z.string().default('gpt-4'),
        temperature: z.number().min(0).max(2).default(0.7),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      // 验证笔记所有权
      const note = await ctx.prisma.note.findFirst({
        where: { id: input.noteId, userId: ctx.user.id },
      });

      if (!note) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '笔记不存在',
        });
      }

      // 添加到 Redis Streams 任务队列
      const taskId = `ai-${Date.now()}-${input.noteId}`;
      await ctx.redis.xadd('ai-task-queue', '*',
        'taskId', taskId,
        'noteId', input.noteId,
        'userId', ctx.user.id,
        'processingOptions', JSON.stringify(input.processingOptions),
        'createdAt', new Date().toISOString()
      );

      return { taskId, status: 'QUEUED' };
    }),
});
```

### 1.3 tRPC 订阅实现

```typescript
// apps/services/src/trpc/subscriptions.router.ts
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { router, protectedProcedure } from '../trpc/trpc.service';
import { z } from 'zod';

// 全局事件发射器
const taskEvents = new EventEmitter();
const aiResultEvents = new EventEmitter();

export const subscriptionsRouter = router({
  // 任务状态更新订阅
  onTaskUpdate: protectedProcedure
    .input(z.object({ taskId: z.string().optional() }))
    .subscription(({ input, ctx }) => {
      return observable<{ taskId: string; status: string; progress: number }>((emit) => {
        const onTaskUpdate = (data: any) => {
          // 如果指定了 taskId，只发送该任务的事件
          if (!input.taskId || data.taskId === input.taskId) {
            // 确保用户只能收到自己的任务事件
            if (data.userId === ctx.user.id) {
              emit.next(data);
            }
          }
        };

        taskEvents.on('task-update', onTaskUpdate);

        return () => {
          taskEvents.off('task-update', onTaskUpdate);
        };
      });
    }),

  // AI 处理结果订阅
  onAiResult: protectedProcedure
    .subscription(({ ctx }) => {
      return observable<any>((emit) => {
        const onAiResult = (data: any) => {
          // 确保用户只能收到自己的 AI 处理结果
          if (data.userId === ctx.user.id) {
            emit.next(data);
          }
        };

        aiResultEvents.on('ai-result', onAiResult);

        return () => {
          aiResultEvents.off('ai-result', onAiResult);
        };
      });
    }),

  // 笔记同步订阅
  onNoteSync: protectedProcedure
    .subscription(({ ctx }) => {
      return observable<any>((emit) => {
        const onNoteSync = (data: any) => {
          // 确保用户只能收到自己的同步事件
          if (data.userId === ctx.user.id) {
            emit.next(data);
          }
        };

        taskEvents.on('note-sync', onNoteSync);

        return () => {
          taskEvents.off('note-sync', onNoteSync);
        };
      });
    }),
});

// 导出事件发射器供其他服务使用
export { taskEvents, aiResultEvents };
```

### 1.4 主路由器

```typescript
// apps/services/src/trpc/app.router.ts
import { router } from './trpc.service';
import { notesRouter } from '../notes/notes.router';
import { subscriptionsRouter } from './subscriptions.router';
import { authRouter } from '../auth/auth.router';
import { tagsRouter } from '../tags/tags.router';

export const appRouter = router({
  notes: notesRouter,
  auth: authRouter,
  tags: tagsRouter,
  subscriptions: subscriptionsRouter,
});

export type AppRouter = typeof appRouter;
```

### 1.5 NestJS 集成

```typescript
// apps/services/src/trpc/trpc.controller.ts
import { Controller } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { createContext, ContextFactory } from './trpc.context';
import { appRouter } from './app.router';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

@Controller('trpc')
export class TrpcController {
  constructor(private readonly trpcService: TrpcService) {}

  // 使用 NestJS Express 适配器
  middleware = createExpressMiddleware({
    router: appRouter,
    createContext,
  });
}
```

```typescript
// apps/services/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcController } from './trpc/trpc.controller';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 设置 tRPC
  const trpcController = app.get(TrpcController);
  app.use('/trpc', trpcController.middleware);

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('Noteum API')
    .setDescription('Noteum 项目 API 文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3001);
  console.log(`🚀 服务运行在: ${await app.getUrl()}`);
  console.log(`📚 API 文档: ${await app.getUrl()}/api`);
}

bootstrap();
```

## 2. React 前端实现

### 2.1 tRPC 客户端配置

```typescript
// apps/client/src/utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import type { AppRouter } from '../../../services/src/trpc/app.router';

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // 浏览器环境
    return import.meta.env.VITE_API_URL || 'http://localhost:3001/trpc';
  }
  // 服务端渲染环境
  return process.env.API_URL || 'http://localhost:3001/trpc';
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 秒
        retry: (failureCount, error) => {
          // 对于 401 错误不重试
          if (error?.data?.code === 'UNAUTHORIZED') return false;
          return failureCount < 3;
        },
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getBaseUrl(),
          headers: () => {
            const token = localStorage.getItem('auth-token');
            return token ? { authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 2.2 Zustand 状态管理集成

```typescript
// apps/client/src/stores/useNotesStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { trpc } from '../utils/trpc';

interface Note {
  id: string;
  title: string;
  content?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  searchQuery: string;
  selectedTags: string[];

  // Actions
  setNotes: (notes: Note[]) => void;
  setCurrentNote: (note: Note | null) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
}

export const useNotesStore = create<NotesState>()(
  devtools(
    (set, get) => ({
      notes: [],
      currentNote: null,
      isLoading: false,
      searchQuery: '',
      selectedTags: [],

      setNotes: (notes) => set({ notes }),

      setCurrentNote: (note) => set({ currentNote: note }),

      addNote: (note) => set((state) => ({
        notes: [note, ...state.notes],
      })),

      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, ...updates } : note
        ),
        currentNote: state.currentNote?.id === id
          ? { ...state.currentNote, ...updates }
          : state.currentNote,
      })),

      removeNote: (id) => set((state) => ({
        notes: state.notes.filter(note => note.id !== id),
        currentNote: state.currentNote?.id === id ? null : state.currentNote,
      })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
    }),
    { name: 'notes-store' }
  )
);

// tRPC 集成的 hooks
export const useNotes = () => {
  const { notes, setNotes, isLoading } = useNotesStore();
  const searchQuery = useNotesStore((state) => state.searchQuery);
  const selectedTags = useNotesStore((state) => state.selectedTags);

  const { data, isLoading: isFetching, refetch } = trpc.notes.list.useQuery({
    limit: 50,
    offset: 0,
    search: searchQuery || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  }, {
    onSuccess: (data) => {
      setNotes(data);
    },
  });

  return {
    notes: data || notes,
    isLoading: isLoading || isFetching,
    refetch,
  };
};

export const useCurrentNote = (id?: string) => {
  const { currentNote, setCurrentNote } = useNotesStore();

  const { data, isLoading } = trpc.notes.getById.useQuery(
    { id: id! },
    {
      enabled: !!id,
      onSuccess: (data) => setCurrentNote(data),
    }
  );

  return {
    note: data || currentNote,
    isLoading,
    setCurrentNote,
  };
};
```

### 2.3 TanStack Router 集成

```typescript
// apps/client/src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TRPCProvider } from '../utils/trpc';
import { Toaster } from '@/components/ui/toaster';

export const Route = createRootRoute({
  component: () => (
    <TRPCProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Outlet />
        <Toaster />
      </div>
    </TRPCProvider>
  ),
});
```

```typescript
// apps/client/src/routes/notes.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useNotes } from '../stores/useNotesStore';
import { NoteCard } from '../components/notes/NoteCard';
import { NoteEditor } from '../components/notes/NoteEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/notes')({
  component: NotesPage,
});

function NotesPage() {
  const { notes, isLoading, refetch } = useNotes();
  const { setSearchQuery, selectedTags, setSelectedTags } = useNotesStore();
  const [searchInput, setSearchInput] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const createNote = trpc.notes.create.useMutation({
    onSuccess: (data) => {
      refetch();
      setIsCreatingNew(false);
    },
  });

  const deleteNote = trpc.notes.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setSearchQuery(value);
  };

  const handleCreateNote = (data: { title: string; content?: string }) => {
    createNote.mutate(data);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('确定要删除这个笔记吗？')) {
      deleteNote.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">我的笔记</h1>
        <Button onClick={() => setIsCreatingNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新建笔记
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索笔记..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 标签过滤 */}
      {selectedTags.length > 0 && (
        <div className="flex gap-2 mb-4">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}

      {/* 新建笔记编辑器 */}
      {isCreatingNew && (
        <div className="mb-6">
          <NoteEditor
            onSave={handleCreateNote}
            onCancel={() => setIsCreatingNew(false)}
          />
        </div>
      )}

      {/* 笔记列表 */}
      <div className="grid gap-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">还没有笔记</p>
            <p className="text-sm">点击上方按钮创建你的第一个笔记</p>
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

### 2.4 tRPC 订阅组件

```typescript
// apps/client/src/components/notifications/TaskNotifications.tsx
import { useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import { useNotesStore } from '../../stores/useNotesStore';
import { toast } from '@/components/ui/use-toast';

export function TaskNotifications() {
  const updateNote = useNotesStore((state) => state.updateNote);
  const { user } = useAuth(); // 假设有 useAuth hook

  // 任务状态更新订阅
  trpc.subscriptions.onTaskUpdate.useSubscription(undefined, {
    onData(data) {
      console.log('任务更新:', data);

      if (data.status === 'COMPLETED') {
        toast({
          title: "任务完成",
          description: `任务 ${data.taskId} 已完成处理`,
        });
      } else if (data.status === 'FAILED') {
        toast({
          title: "任务失败",
          description: `任务 ${data.taskId} 处理失败`,
          variant: "destructive",
        });
      }
    },
  });

  // AI 处理结果订阅
  trpc.subscriptions.onAiResult.useSubscription(undefined, {
    onData(data) {
      console.log('AI 处理结果:', data);

      const { result } = data;

      // 更新本地笔记状态
      if (result.action === 'UPDATE_ORIGINAL' && result.updatedNote) {
        updateNote(result.noteId, result.updatedNote);
      }

      // 显示通知
      switch (result.action) {
        case 'CREATE_CHILD_NOTE':
          toast({
            title: "AI 处理完成",
            description: "已创建 AI 处理结果笔记",
          });
          break;
        case 'UPDATE_ORIGINAL':
          toast({
            title: "笔记已更新",
            description: "笔记已通过 AI 处理更新",
          });
          break;
        case 'REQUEST_CONFIRMATION':
          // 显示确认对话框
          showAiResultDialog(result);
          break;
      }
    },
  });

  // 笔记同步订阅
  trpc.subscriptions.onNoteSync.useSubscription(undefined, {
    onData(data) {
      console.log('笔记同步:', data);

      switch (data.type) {
        case 'NOTE_CREATED':
          // 笔记创建成功
          break;
        case 'NOTE_UPDATED':
          updateNote(data.noteId, data.updates);
          break;
        case 'NOTE_DELETED':
          // 笔记删除成功
          break;
      }
    },
  });

  return null;
}

// AI 结果确认对话框
function showAiResultDialog(result: any) {
  // 这里可以集成 shadcn/ui 的 Dialog 组件
  // 或者使用路由导航到专门的确认页面
  console.log('需要用户确认 AI 处理结果:', result);
}
```

### 2.5 AI 处理组件

```typescript
// apps/client/src/components/notes/AiProcessor.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Brain, Loader2 } from 'lucide-react';
import { trpc } from '../../utils/trpc';

interface AiProcessorProps {
  noteId: string;
  onProcessingStart?: () => void;
  onProcessingComplete?: (result: any) => void;
}

export function AiProcessor({
  noteId,
  onProcessingStart,
  onProcessingComplete
}: AiProcessorProps) {
  const [processingType, setProcessingType] = useState('SUMMARIZE');
  const [temperature, setTemperature] = useState([0.7]);

  const submitAiProcessing = trpc.notes.submitAiProcessing.useMutation({
    onSuccess: (data) => {
      onProcessingStart?.();
      console.log('AI 处理任务已提交:', data);
    },
  });

  const handleProcess = () => {
    submitAiProcessing.mutate({
      noteId,
      processingOptions: {
        type: processingType,
        temperature: temperature[0],
      },
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold">AI 智能处理</h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="processing-type">处理类型</Label>
          <Select value={processingType} onValueChange={setProcessingType}>
            <SelectTrigger>
              <SelectValue placeholder="选择处理类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUMMARIZE">内容总结</SelectItem>
              <SelectItem value="EXTRACT_INSIGHTS">提取要点</SelectItem>
              <SelectItem value="GENERATE_RELATED">生成相关内容</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>创造性: {temperature[0].toFixed(1)}</Label>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            max={2}
            min={0}
            step={0.1}
            className="mt-2"
          />
        </div>
      </div>

      <Button
        onClick={handleProcess}
        disabled={submitAiProcessing.isLoading}
        className="w-full"
      >
        {submitAiProcessing.isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <Brain className="w-4 h-4 mr-2" />
            开始 AI 处理
          </>
        )}
      </Button>
    </div>
  );
}
```

## 3. Redis Streams 集成

### 3.1 Redis 服务

```typescript
// apps/services/src/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private subscriber: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    this.subscriber = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });

    console.log('✅ Redis 连接已建立');
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.subscriber.quit();
    console.log('🔴 Redis 连接已关闭');
  }

  // Redis Streams 操作
  async xadd(stream: string, ...args: string[]): Promise<string> {
    return this.client.xadd(stream, '*', ...args);
  }

  async xreadgroup(
    group: string,
    consumer: string,
    ...args: string[]
  ): Promise<any[]> {
    return this.client.xreadgroup('GROUP', group, consumer, ...args);
  }

  async xack(stream: string, group: string, messageId: string): Promise<number> {
    return this.client.xack(stream, group, messageId);
  }

  async xgroup(
    command: 'CREATE' | 'SETID' | 'DESTROY' | 'DELCONSUMER',
    ...args: string[]
  ): Promise<string | number> {
    return this.client.xgroup(command, ...args);
  }

  // 常规 Redis 操作
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<string> {
    if (ttl) {
      return this.client.setex(key, ttl, value);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  // 发布订阅
  async publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message);
  }

  async subscribe(channel: string, callback: (channel: string, message: string) => void): Promise<void> {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', callback);
  }
}
```

### 3.2 任务队列处理器

```typescript
// apps/services/src/queue/task-queue.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { AiProcessingService } from '../ai/ai-processing.service';
import { taskEvents, aiResultEvents } from '../trpc/subscriptions.router';

@Injectable()
export class TaskQueueService implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly aiProcessingService: AiProcessingService
  ) {}

  async onModuleInit() {
    // 创建消费者组
    try {
      await this.redisService.xgroup(
        'CREATE',
        'ai-task-queue',
        'ai-processors',
        '0',
        'MKSTREAM'
      );
    } catch (error) {
      // 消费者组可能已存在
      console.log('消费者组已存在或创建失败:', error.message);
    }

    // 启动消费者
    this.startAiConsumer();
    console.log('🚀 AI 任务队列消费者已启动');
  }

  private async startAiConsumer(): Promise<void> {
    const consumerGroup = 'ai-processors';
    const consumerId = `ai-processor-${Date.now()}`;

    while (true) {
      try {
        const results = await this.redisService.xreadgroup(
          consumerGroup,
          consumerId,
          'COUNT',
          1,
          'BLOCK',
          1000,
          'STREAMS',
          'ai-task-queue',
          '>'
        );

        if (results && results.length > 0) {
          const [streamName, messages] = results[0];

          for (const [messageId, fields] of messages) {
            try {
              const taskData = {
                taskId: fields.taskId,
                noteId: fields.noteId,
                userId: fields.userId,
                processingOptions: JSON.parse(fields.processingOptions),
                createdAt: new Date(fields.createdAt),
              };

              // 处理任务
              await this.processAiTask(taskData);

              // 确认消息处理完成
              await this.redisService.xack(streamName, consumerGroup, messageId);

            } catch (error) {
              console.error(`处理消息 ${messageId} 时出错:`, error);
            }
          }
        }
      } catch (error) {
        console.error('AI 消费者错误:', error);
        await this.sleep(5000); // 错误后等待 5 秒
      }
    }
  }

  private async processAiTask(taskData: any): Promise<void> {
    const { taskId, noteId, userId, processingOptions } = taskData;

    try {
      // 通知任务开始
      taskEvents.emit('task-update', {
        taskId,
        userId,
        status: 'PROCESSING',
        progress: 10,
      });

      // 执行 AI 处理
      const result = await this.aiProcessingService.processNote({
        noteId,
        userId,
        options: processingOptions,
        onProgress: (progress) => {
          taskEvents.emit('task-update', {
            taskId,
            userId,
            status: 'PROCESSING',
            progress,
          });
        },
      });

      // 通知任务完成
      taskEvents.emit('task-update', {
        taskId,
        userId,
        status: 'COMPLETED',
        progress: 100,
      });

      // 发送 AI 处理结果
      aiResultEvents.emit('ai-result', {
        userId,
        result,
      });

    } catch (error) {
      console.error(`AI 任务 ${taskId} 处理失败:`, error);

      // 通知任务失败
      taskEvents.emit('task-update', {
        taskId,
        userId,
        status: 'FAILED',
        progress: 0,
        error: error.message,
      });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## 4. 类型安全与验证

### 4.1 Zod Schema 定义

```typescript
// apps/services/src/trpc/schemas/notes.schema.ts
import { z } from 'zod';

export const CreateNoteSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(255, '标题过长'),
  content: z.string().optional(),
  tags: z.array(z.string()).max(10, '标签数量不能超过 10 个').optional(),
  isPublic: z.boolean().default(false),
});

export const UpdateNoteSchema = CreateNoteSchema.partial().extend({
  id: z.string().uuid('无效的笔记 ID'),
});

export const GetNotesSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  search: z.string().max(100).optional(),
  tags: z.array(z.string()).max(20).optional(),
  sortBy: z.enum(['updatedAt', 'createdAt', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const AiProcessingOptionsSchema = z.object({
  type: z.enum(['SUMMARIZE', 'EXTRACT_INSIGHTS', 'GENERATE_RELATED']),
  model: z.string().default('gpt-4'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(100).max(4000).default(2000),
});

// 导出类型供客户端使用
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
export type GetNotesInput = z.infer<typeof GetNotesSchema>;
export type AiProcessingOptions = z.infer<typeof AiProcessingOptionsSchema>;
```

### 4.2 错误处理

```typescript
// apps/services/src/trpc/trpc.error-handler.ts
import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

export class TrpcErrorHandler {
  static handleValidationError(error: ZodError): never {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: '输入验证失败',
      cause: error,
    });
  }

  static handleNotFound(resource: string): never {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `${resource} 不存在`,
    });
  }

  static handleUnauthorized(message: string = '未授权访问'): never {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message,
    });
  }

  static handleForbidden(message: string = '权限不足'): never {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message,
    });
  }

  static handleInternalError(error: Error, message?: string): never {
    console.error('内部服务器错误:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: message || '服务器内部错误',
      cause: error,
    });
  }
}
```

## 5. 测试

### 5.1 单元测试

```typescript
// apps/services/src/notes/notes.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { TRPCError } from '@trpc/server';

describe('NotesService', () => {
  let service: NotesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    note: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const userId = 'user-123';
      const noteData = {
        title: '测试笔记',
        content: '测试内容',
        tags: ['test'],
      };

      const expectedNote = {
        id: 'note-123',
        ...noteData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.note.create.mockResolvedValue(expectedNote);

      const result = await service.createNote(userId, noteData);

      expect(result).toEqual(expectedNote);
      expect(prismaService.note.create).toHaveBeenCalledWith({
        data: { ...noteData, userId },
      });
    });
  });

  describe('getNoteById', () => {
    it('should return note if found', async () => {
      const userId = 'user-123';
      const noteId = 'note-123';
      const expectedNote = {
        id: noteId,
        title: '测试笔记',
        userId,
      };

      mockPrismaService.note.findFirst.mockResolvedValue(expectedNote);

      const result = await service.getNoteById(userId, noteId);

      expect(result).toEqual(expectedNote);
    });

    it('should throw NOT_FOUND if note not found', async () => {
      const userId = 'user-123';
      const noteId = 'nonexistent';

      mockPrismaService.note.findFirst.mockResolvedValue(null);

      await expect(service.getNoteById(userId, noteId))
        .rejects.toThrow(TRPCError);
    });
  });
});
```

### 5.2 集成测试

```typescript
// apps/client/src/components/notes/__tests__/NoteList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NoteList } from '../NoteList';
import { trpc } from '../../../utils/trpc';
import { vi } from 'vitest';

// Mock tRPC
vi.mock('../../../utils/trpc', () => ({
  trpc: {
    notes: {
      list: {
        useQuery: vi.fn(),
      },
      delete: {
        useMutation: vi.fn(),
      },
    },
  },
}));

describe('NoteList', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <NoteList />
      </QueryClientProvider>
    );
  };

  it('should display loading state', () => {
    vi.mocked(trpc.notes.list.useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderComponent();

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('should display notes when loaded', async () => {
    const mockNotes = [
      { id: '1', title: '笔记 1', content: '内容 1' },
      { id: '2', title: '笔记 2', content: '内容 2' },
    ];

    vi.mocked(trpc.notes.list.useQuery).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      error: null,
    } as any);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('笔记 1')).toBeInTheDocument();
      expect(screen.getByText('笔记 2')).toBeInTheDocument();
    });
  });

  it('should display error message', () => {
    vi.mocked(trpc.notes.list.useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('加载失败'),
    } as any);

    renderComponent();

    expect(screen.getByText('加载失败')).toBeInTheDocument();
  });
});
```

## 6. 部署配置

### 6.1 环境变量配置

```bash
# .env.production
# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/noteum"

# Redis 配置
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# JWT 配置
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# API 配置
PORT=3001
NODE_ENV="production"
CORS_ORIGIN="https://yourapp.com"

# OpenAI 配置
OPENAI_API_KEY="your-openai-key"
```

```bash
# apps/client/.env.production
VITE_API_URL="https://api.yourapp.com/trpc"
VITE_APP_URL="https://yourapp.com"
```

### 6.2 Docker 配置

```dockerfile
# apps/services/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./
COPY apps/services/package*.json ./apps/services/
COPY packages/utils/package*.json ./packages/utils/

# 安装依赖
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY apps/services ./apps/services
COPY packages/utils ./packages/utils

# 生成 Prisma 客户端
RUN pnpm --filter @noteum/services prisma generate

# 构建应用
RUN pnpm --filter @noteum/services build

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["pnpm", "--filter", "@noteum/services", "start:prod"]
```

## 7. 性能优化

### 7.1 查询优化

```typescript
// 使用 Prisma 的 include 和 select 优化查询
const optimizedNotesQuery = async (userId: string, options: GetNotesInput) => {
  return await prisma.note.findMany({
    where: {
      userId,
      // ... 其他过滤条件
    },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      tags: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          childNotes: true,
        },
      },
    },
    orderBy: { [options.sortBy]: options.sortOrder },
    take: options.limit,
    skip: options.offset,
  });
};
```

### 7.2 缓存策略

```typescript
// Redis 缓存装饰器
export function Cache(ttl: number = 300) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;

      // 尝试从缓存获取
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // 执行原方法
      const result = await method.apply(this, args);

      // 存入缓存
      await this.redisService.set(cacheKey, JSON.stringify(result), ttl);

      return result;
    };
  };
}

// 使用示例
class NotesService {
  @Cache(600) // 缓存 10 分钟
  async getPopularNotes(userId: string, limit: number = 10) {
    // 实现逻辑
  }
}
```

## 总结

这个 tRPC 实现指南展示了如何在 Noteum 项目中：

✅ **完全类型安全的 API** - 从服务器到客户端的端到端类型安全
✅ **现代化技术栈集成** - NestJS + React + TanStack Router + Zustand + Prisma
✅ **实时通信** - 基于 tRPC 订阅的实时通知机制
✅ **高性能任务队列** - Redis Streams 实现的持久化任务处理
✅ **AI 集成** - LangChain.js + LangGraph 工作流集成
✅ **完整的错误处理** - 类型安全的错误处理和用户友好的错误提示
✅ **可测试架构** - 单元测试和集成测试支持

这套架构为笔记管理应用提供了强大、可扩展、类型安全的基础设施。