# API 设计规范

## 基本原则

1. RESTful 设计
2. 统一的返回格式
3. 清晰的错误处理
4. 版本控制
5. 安全性优先

## URL 设计

### 基本规则

1. 使用名词而不是动词
2. 使用复数形式
3. 使用小写字母
4. 使用连字符（-）而不是下划线（_）
5. 避免文件扩展名

```
✅ 推荐：
GET /api/v1/users
GET /api/v1/user-profiles
POST /api/v1/articles

❌ 避免：
GET /api/v1/getUsers
GET /api/v1/user_profiles
POST /api/v1/createArticle
```

### 资源层级

```
# 获取用户的所有笔记
GET /api/v1/users/{userId}/notes

# 获取特定笔记的所有评论
GET /api/v1/notes/{noteId}/comments

# 获取特定评论的详情
GET /api/v1/comments/{commentId}
```

## HTTP 方法使用

### 标准方法

```
GET     - 获取资源
POST    - 创建资源
PUT     - 完全更新资源
PATCH   - 部分更新资源
DELETE  - 删除资源
```

### 示例

```
# 获取用户列表
GET /api/v1/users

# 创建新用户
POST /api/v1/users

# 更新用户全部信息
PUT /api/v1/users/{userId}

# 更新用户部分信息
PATCH /api/v1/users/{userId}

# 删除用户
DELETE /api/v1/users/{userId}
```

## 查询参数规范

### 分页参数

```
GET /api/v1/users?page=1&limit=10
GET /api/v1/users?cursor=abc123&limit=10
```

### 筛选参数

```
GET /api/v1/users?role=admin
GET /api/v1/articles?status=published&category=tech
```

### 排序参数

```
GET /api/v1/users?sort=name
GET /api/v1/users?sort=-createdAt    # 降序排列
```

### 字段选择

```
GET /api/v1/users?fields=id,name,email
```

## 响应格式

### 成功响应

```json
{
  "code": 200,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "操作成功"
}
```

### 列表响应

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "123",
        "name": "John Doe"
      },
      {
        "id": "124",
        "name": "Jane Doe"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "hasMore": true
    }
  },
  "message": "获取成功"
}
```

### 错误响应

```json
{
  "code": 400,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## 错误处理

### HTTP 状态码使用

```
200 - OK                # 请求成功
201 - Created          # 创建成功
204 - No Content       # 删除成功
400 - Bad Request      # 参数错误
401 - Unauthorized     # 未认证
403 - Forbidden        # 无权限
404 - Not Found        # 资源不存在
422 - Unprocessable   # 验证错误
500 - Server Error     # 服务器错误
```

### 错误代码定义

```typescript
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}
```

## 认证和授权

### Bearer Token

```
Authorization: Bearer <token>
```

### API Key

```
X-API-Key: <api-key>
```

### 权限控制

```typescript
// 路由级别权限
router.use('/admin/*', requireAdmin);

// 操作级别权限
@RequirePermission('note:write')
async createNote() {
  // 实现
}
```

## 版本控制

### URL 版本

```
/api/v1/users
/api/v2/users
```

### Header 版本

```
Accept: application/vnd.app.v1+json
```

## 请求/响应规范

### 请求头规范

```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
X-Request-ID: <uuid>
```

### 响应头规范

```
Content-Type: application/json
X-Request-ID: <uuid>
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 99
X-Rate-Limit-Reset: 1623456789
```

## 安全规范

### 接口安全

1. 使用 HTTPS
2. 实施速率限制
3. 验证所有输入
4. 实施 CORS 策略
5. 设置适当的超时

### CORS 配置

```typescript
app.use(cors({
  origin: ['https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Request-ID'],
  credentials: true,
  maxAge: 86400
}));
```

## API 文档

### OpenAPI 规范

```yaml
openapi: 3.0.0
info:
  title: 应用 API
  version: 1.0.0
paths:
  /users:
    get:
      summary: 获取用户列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: 成功返回用户列表
```

### 文档示例

```typescript
/**
 * @api {post} /api/v1/users 创建用户
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} name 用户名
 * @apiParam {String} email 邮箱
 *
 * @apiSuccess {Object} data 用户信息
 * @apiSuccess {String} data.id 用户ID
 * @apiSuccess {String} data.name 用户名
 * @apiSuccess {String} data.email 邮箱
 */
```

## 性能优化

### 缓存策略

```
Cache-Control: max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### 数据压缩

```typescript
app.use(compression());
```

### 批量操作

```
POST /api/v1/users/batch
{
  "operations": [
    { "method": "POST", "path": "/users", "body": { ... } },
    { "method": "PUT", "path": "/users/123", "body": { ... } }
  ]
}
```

## 监控和日志

### 请求日志

```typescript
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    requestId: req.headers['x-request-id'],
    userId: req.user?.id
  });
  next();
});
```

### 性能指标

```typescript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.recordResponseTime(duration);
  });
  next();
});
```

## 测试规范

### 端点测试

```typescript
describe('User API', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Test User',
        email: 'test@example.com'
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      name: 'Test User',
      email: 'test@example.com'
    });
  });
});
```

## 变更管理

### API 废弃流程

1. 在文档中标记为废弃
2. 返回 Deprecation 警告头
3. 设置合理的过渡期
4. 保持向后兼容

### 示例

```typescript
app.use((req, res, next) => {
  if (req.path.startsWith('/api/v1')) {
    res.set('Deprecation', 'version="2024-12-31"');
    res.set('Link', '</api/v2>; rel="successor-version"');
  }
  next();
});