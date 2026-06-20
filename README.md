# 志愿活动报名管理系统

一个功能完整的志愿活动发布与报名管理系统，支持活动创建、报名、取消、编辑和状态管理。

## 功能介绍

### 核心功能
- **活动管理**：创建、编辑、删除志愿活动，支持修改活动时间、地点、人数上限、说明和状态
- **报名管理**：用户报名、取消报名、重复报名拦截、满员拦截、名额自动释放
- **状态管理**：活动状态（招募中/已满员/已结束）自动流转和手动管理
- **筛选浏览**：按活动状态筛选，查看活动详情和报名名单
- **数据验证**：完整的前后端数据校验，人数下限保护

### 用户体验
- 页面内确认弹窗替代浏览器原生确认框
- 接口错误自然显示在对应表单或操作区域
- 空状态清晰说明，引导用户操作
- 操作后数据即时更新（报名名单、剩余名额、活动状态）

## 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **前端** | React 18 + TypeScript | UI 框架 |
| | React Router v7 | 路由管理 |
| | Zustand | 状态管理 |
| | Tailwind CSS | 样式框架 |
| | Lucide React | 图标库 |
| | Vite | 构建工具 |
| **后端** | Express.js | Web 框架 |
| | TypeScript | 类型安全 |
| | CORS | 跨域支持 |
| | Dotenv | 环境变量 |
| **开发工具** | ESLint + typescript-eslint | 代码检查 |
| | Nodemon + tsx | 后端热重载 |
| | Concurrently | 前后端并发启动 |

## 项目结构

```
gsb-0016/
├── api/                     # 后端代码
│   ├── data/               # 数据层
│   │   └── mockData.ts     # 初始模拟数据
│   ├── routes/             # 路由层
│   │   └── activities.ts   # 活动相关接口
│   ├── store/              # 数据存储
│   │   └── dataStore.ts    # 内存数据存储（含业务逻辑）
│   ├── app.ts              # Express 应用配置
│   ├── server.ts           # 服务器启动入口
│   └── index.ts            # Vercel 部署入口
├── shared/                 # 共享类型定义
│   └── types.ts            # 前后端共用类型
├── src/                    # 前端代码
│   ├── api/                # API 调用层
│   │   └── activityApi.ts  # 活动接口封装
│   ├── components/         # React 组件
│   │   ├── ActivityCard.tsx      # 活动卡片
│   │   ├── ActivityDetail.tsx    # 活动详情弹窗
│   │   ├── ActivityFilter.tsx    # 状态筛选器
│   │   └── Header.tsx            # 页面头部
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx             # 活动列表页
│   │   ├── CreateActivity.tsx   # 创建活动页
│   │   └── EditActivity.tsx     # 编辑活动页
│   ├── store/              # 前端状态管理
│   │   └── useActivityStore.ts  # Zustand store
│   ├── utils/              # 工具函数
│   │   └── format.ts       # 日期时间格式化
│   ├── App.tsx             # 应用根组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── scripts/                # 脚本
│   └── test-api.ts         # API 自动化验证脚本
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 依赖安装

```bash
npm install
```

### 启动开发环境

**方式一：同时启动前后端（推荐）**
```bash
npm run dev
```
- 前端：http://localhost:5173
- 后端：http://localhost:3001

**方式二：分别启动**
```bash
# 启动前端（终端 1）
npm run client:dev

# 启动后端（终端 2）
npm run server:dev
```

### 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

## 接口列表

所有接口前缀：`/api`

### 活动管理

| 方法 | 路径 | 说明 | 请求体 | 成功响应 |
|------|------|------|--------|---------|
| GET | `/activities` | 获取活动列表 | - | `{ success: true, data: ActivityWithRegistrations[] }` |
| GET | `/activities/:id` | 获取单个活动详情 | - | `{ success: true, data: ActivityWithRegistrations }` |
| POST | `/activities` | 创建活动 | `{ title, description?, location, startTime, endTime, maxParticipants, status? }` | `{ success: true, data: ActivityWithRegistrations }` |
| PUT | `/activities/:id` | 编辑活动 | `{ title?, description?, location?, startTime?, endTime?, maxParticipants?, status? }` | `{ success: true, data: ActivityWithRegistrations }` |
| DELETE | `/activities/:id` | 删除活动 | - | `{ success: true }` |

### 报名管理

| 方法 | 路径 | 说明 | 请求体 | 成功响应 |
|------|------|------|--------|---------|
| GET | `/activities/:id/registrations` | 获取报名名单 | - | `{ success: true, data: Registration[] }` |
| POST | `/activities/:id/register` | 报名 | `{ userName, userPhone }` | `{ success: true, data: Registration, activity: ActivityWithRegistrations }` |
| DELETE | `/activities/:id/register/:registrationId` | 取消报名 | - | `{ success: true, activity: ActivityWithRegistrations }` |

### 其他

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |

### 错误响应格式

```json
{
  "success": false,
  "error": "错误信息描述"
}
```

常见错误：
- `400` - 参数错误、业务规则不满足（如名额已满、重复报名等）
- `404` - 资源不存在
- `500` - 服务器内部错误

## 页面使用流程

### 1. 浏览活动列表
1. 访问首页 `http://localhost:5173`
2. 查看所有志愿活动卡片，显示活动状态、时间、地点、报名进度
3. 使用顶部筛选器按状态筛选（全部/招募中/已满员/已结束）
4. 点击活动卡片查看详情

### 2. 创建活动
1. 点击右上角「发布活动」按钮
2. 填写活动信息：
   - 活动名称（必填）
   - 开始时间、结束时间（必填）
   - 活动地点（必填）
   - 人数上限（必填，最小 1）
   - 活动状态（默认招募中）
   - 活动说明（可选）
3. 点击「发布活动」，成功后自动跳转回首页并高亮新活动

### 3. 报名活动
1. 在活动列表中点击活动卡片进入详情
2. 查看活动详情和当前报名情况
3. 点击「立即报名」
4. 填写姓名和手机号（手机号用于识别报名身份）
5. 点击「确认报名」，成功后显示提示并更新报名名单

### 4. 取消报名
1. 进入已报名的活动详情
2. 点击「取消报名」
3. 在页面内确认弹窗中点击「确认取消」
4. 取消成功后，名额自动释放，活动状态可能从「已满员」变回「招募中」

### 5. 编辑活动
1. 进入活动详情
2. 点击右上角编辑图标（✏️）
3. 修改活动信息：
   - 活动标题、时间、地点、说明
   - 人数上限（不能低于当前已报名人数）
   - 活动状态（招募中/已满员/已结束）
4. 点击「保存修改」

## 验证命令

### 代码质量检查

```bash
# TypeScript 类型检查
npm run check

# ESLint 代码检查
npm run lint

# 生产构建（含类型检查）
npm run build
```

### API 自动化测试

确保后端服务已启动（`npm run server:dev`），然后运行：

```bash
npm run test:api
```

测试覆盖场景（共 19 个用例）：
1. ✅ 健康检查接口
2. ✅ 获取活动列表
3. ✅ 创建活动成功
4. ✅ 创建活动 - 缺少必填字段拦截
5. ✅ 报名成功 - 用户1
6. ✅ 报名成功 - 用户2
7. ✅ 报名成功 - 用户3（名额已满）
8. ✅ 满员拦截
9. ✅ 重复报名拦截
10. ✅ 满员后状态自动更新为「已满员」
11. ✅ 取消报名成功
12. ✅ 取消后名额释放、状态恢复招募中
13. ✅ 取消后新用户可报名
14. ✅ 获取报名名单
15. ✅ 编辑活动成功
16. ✅ 编辑活动 - 人数上限低于已报名人数拦截
17. ✅ 编辑活动状态为已结束
18. ✅ 已结束活动无法报名
19. ✅ 获取不存在的活动 - 返回 404 错误
20. ✅ 向不存在的活动报名 - 返回错误

### 实际验证结果

```
$ npm run check
# 输出：无错误，退出码 0

$ npm run lint
# 输出：无错误，退出码 0

$ npm run build
# 输出：构建成功，产物在 dist/

$ npm run test:api
# 输出：
# ========================================
#   测试完成: 19 通过, 0 失败
# ========================================
```

## 常见问题

### Q1: 启动后前端无法调用后端 API？
**A**: 检查后端是否正常启动在 3001 端口。Vite 已配置 `/api` 代理到 `http://localhost:3001`，确保后端服务已启动。

### Q2: 修改后端代码后没有自动重启？
**A**: 后端使用 Nodemon 监听 `api/` 和 `shared/` 目录下的文件变化，修改这些目录下的文件会自动重启。

### Q3: 人数上限修改时为什么不能低于当前报名人数？
**A**: 为了保护已报名用户的数据完整性，系统不允许将人数上限设置为低于已报名人数。如需减少名额，请先联系已报名用户取消。

### Q4: 手机号重复报名被拦截了怎么办？
**A**: 系统使用手机号作为报名唯一标识。如确实需要帮他人报名，请使用不同的手机号。

### Q5: 取消报名后名额没有立即释放？
**A**: 取消报名成功后，前端会自动刷新数据。如果名额没有更新，请检查网络连接或刷新页面重试。

### Q6: 数据会持久化吗？
**A**: 当前版本使用内存存储，重启服务后数据会重置为初始模拟数据。如需持久化，请集成数据库（如 SQLite、PostgreSQL 等）。

### Q7: 如何部署到生产环境？
**A**: 
1. 执行 `npm run build` 构建前端
2. 后端使用 `node api/server.js` 或部署到支持 Node.js 的平台（如 Vercel、Render 等）
3. 项目已包含 `vercel.json` 配置，可直接部署到 Vercel

## 业务规则说明

1. **报名优先级**：先检查用户是否已报名，再检查名额是否已满
2. **状态自动流转**：
   - 报名人数达到上限时，活动状态自动变为「已满员」
   - 取消报名后名额有空缺时，活动状态自动变回「招募中」
3. **已结束活动**：无法报名，但可以查看详情和报名名单
4. **编辑保护**：人数上限不能低于当前已报名人数
