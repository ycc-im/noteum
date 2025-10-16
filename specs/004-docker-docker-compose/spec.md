# Feature Specification: Docker开发环境修复

**Feature Branch**: `004-docker-docker-compose`
**Created**: 2025-10-16
**Status**: Draft
**Input**: User description: "任务是修复 docker 开发环境 @docker-compose.dev.yml 中的潜在问题：1. 在services端报错：请分析prisma的逻辑， 是不是要在每次启动前进行设置什么的？因为现在不管有没有在本地文件中进行过 prisma generate 在容器中都会报这个错误。 又或者是不是现在的容器文件映射有问题导致的？ 2. 在client端一直报错：sh: vite: not found，看上去是不是也是映射有问题？请深度 think harder, 找出两个问题的原因。 最终让我们完成一个可以在本地修改后自动热跟新进行实时验证的开发环境。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 可靠的Docker开发环境启动 (Priority: P1)

开发者能够通过Docker Compose一键启动完整的开发环境，包括数据库、后端服务和前端应用，所有服务正常运行且支持热重载。

**Why this priority**: 这是基础开发环境的核心需求，没有稳定可用的开发环境，其他功能都无法正常开发和测试。

**Independent Test**: 可以通过运行 `docker-compose -f docker-compose.dev.yml up` 启动所有服务，并验证每个服务都正常启动且健康检查通过。

**Acceptance Scenarios**:

1. **Given** 开发者拥有项目代码，**When** 运行 `docker-compose -f docker-compose.dev.yml up`，**Then** PostgreSQL、Redis、NestJS服务和客户端应用都成功启动
2. **Given** Docker开发环境正在运行，**When** 访问 http://localhost:9158，**Then** 前端应用正常加载且无错误
3. **Given** Docker开发环境正在运行，**When** 访问 http://localhost:9168/health，**Then** 后端健康检查返回正常状态
4. **Given** 服务启动，**When** 查看容器日志，**Then** 没有Prisma生成错误或Vite找不到的错误

---

### User Story 2 - 代码热重载功能 (Priority: P1)

开发者能够在本地修改代码后，自动在容器中反映更改并重新加载应用，无需手动重启容器。

**Why this priority**: 热重载是现代开发环境的核心功能，直接影响开发效率和体验。

**Independent Test**: 可以通过修改本地源代码文件，观察容器内应用是否自动重新编译和加载更改。

**Acceptance Scenarios**:

1. **Given** Docker开发环境正在运行，**When** 修改后端TypeScript文件，**Then** NestJS自动重新编译并重启服务
2. **Given** Docker开发环境正在运行，**When** 修改前端React组件文件，**Then** Vite自动重新编译并刷新浏览器
3. **Given** 修改了代码，**When** 等待几秒钟，**Then** 更改在应用中生效且无需手动重启容器
4. **Given** 代码有语法错误，**When** 保存文件，**Then** 容器内显示错误信息但服务继续运行

---

### User Story 3 - 数据库模式管理 (Priority: P2)

开发者能够在容器环境中正确管理Prisma数据库模式，包括生成客户端、运行迁移等操作。

**Why this priority**: 数据库层是应用的核心，Prisma配置问题会阻止后端服务正常启动。

**Independent Test**: 可以通过容器启动时的日志验证Prisma客户端正确生成，数据库连接正常。

**Acceptance Scenarios**:

1. **Given** 容器首次启动，**When** NestJS服务启动，**Then** Prisma客户端自动生成且无错误
2. **Given** 数据库模式文件被修改，**When** 重启服务容器，**Then** 新的Prisma客户端正确生成
3. **Given** 服务运行中，**When** 执行数据库迁移，**Then** 迁移成功且数据库结构更新
4. **Given** 容器重启，**When** 检查服务状态，**Then** 数据库连接正常且模式同步

---

### Edge Cases

- 当本地 `node_modules` 与容器内不一致时会发生什么？
- 如果 Docker 容器权限配置不正确，文件热重载是否会失败？
- 数据库连接失败时，容器是否会无限重启？
- 端口冲突时如何处理？

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Docker开发环境 MUST 支持 PostgreSQL、Redis、NestJS服务和前端应用的一键启动
- **FR-002**: 系统 MUST 正确处理Prisma客户端生成，确保在容器启动时自动生成最新的客户端代码
- **FR-003**: 文件映射 MUST 正确配置，使得本地代码更改能够同步到容器内且不破坏依赖关系
- **FR-004**: 前端开发服务器 MUST 在容器内正确找到并运行Vite命令
- **FR-005**: 热重载功能 MUST 在容器环境中正常工作，支持TypeScript和React文件的实时编译
- **FR-006**: 容器健康检查 MUST 准确反映服务状态，包括数据库连接检查
- **FR-007**: 系统 MUST 处理容器重启时的状态恢复，包括数据库重新连接和Prisma客户端重新生成
- **FR-008**: 错误日志 MUST 清晰显示在容器输出中，便于开发者调试问题

### Key Entities *(include if feature involves data)*

- **Docker Compose配置**: 开发环境的容器编排配置，包括服务定义、网络和卷映射
- **NestJS服务容器**: 后端API服务的运行环境，包括Prisma和依赖管理
- **前端应用容器**: React应用的开发环境，包括Vite和热重载
- **PostgreSQL容器**: 数据库服务，支持pgvector扩展
- **Redis容器**: 缓存服务，用于会话和临时数据存储

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 开发者能够在5分钟内从零启动完整的Docker开发环境
- **SC-002**: 代码更改到应用重新加载的时间不超过10秒
- **SC-003**: 容器启动成功率100%，无Prisma或Vite相关错误
- **SC-004**: 开发者连续工作4小时，环境稳定运行无崩溃
- **SC-005**: 新团队成员能够按照文档成功搭建开发环境，成功率95%以上