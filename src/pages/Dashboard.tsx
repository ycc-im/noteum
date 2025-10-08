import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate">
              仪表板
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              欢迎回到 Noteum，管理您的笔记和知识体系
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button>新建笔记</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        📝
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        总笔记数
                      </dt>
                      <dd className="text-lg font-medium text-foreground">
                        42
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🔗</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        连接数
                      </dt>
                      <dd className="text-lg font-medium text-foreground">
                        128
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⭐</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        收藏笔记
                      </dt>
                      <dd className="text-lg font-medium text-foreground">7</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground truncate">
                        本周活动
                      </dt>
                      <dd className="text-lg font-medium text-foreground">
                        15
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>最近的笔记</CardTitle>
              <CardDescription>您最近编辑或创建的笔记</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-3">
                {/* Placeholder recent notes */}
                {[
                  { title: '项目计划文档', time: '2 小时前' },
                  { title: '会议记录 - 产品讨论', time: '昨天' },
                  { title: 'React 最佳实践', time: '3 天前' },
                ].map((note, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary rounded-md hover:bg-secondary/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {note.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {note.time}
                      </p>
                    </div>
                    <Button
                      variant="link"
                      className="text-primary hover:text-primary/90 text-sm font-medium p-0 h-auto"
                    >
                      编辑
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
