# 待办日历 - 周视图 (Todo Calendar)

一个简洁高效的周视图待办日历 Web 应用，支持手机端访问。

## 功能特性

- **周视图日历**：7 列网格展示周一到周日的待办事项
- **数据持久化**：使用 IndexedDB（自动降级到 localStorage）在浏览器本地存储数据
- **任务管理**：创建、编辑、删除、完成待办事项
- **统计功能**：实时显示本周已完成/待办/总数/完成率
- **移动端适配**：手机端横向滑动浏览，右下角浮动新建按钮
- **复制任务**：快速复制任务到其他日期
- **隐藏已完成**：可选隐藏已完成的任务

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS v4
- **UI 组件**: shadcn/ui
- **状态管理**: TanStack Query (React Query)
- **表单验证**: Zod + React Hook Form
- **日期处理**: date-fns
- **数据存储**: idb (IndexedDB 封装库)
- **通知**: sonner (Toast)

## 项目结构

```
todo-list/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页面（周视图）
│   │   └── globals.css         # 全局样式
│   ├── components/             # React 组件
│   │   ├── ui/                 # shadcn/ui 基础组件
│   │   ├── week-header.tsx     # 周视图头部
│   │   ├── week-grid.tsx       # 周网格
│   │   ├── day-column.tsx      # 单日列
│   │   ├── todo-card.tsx       # 任务卡片
│   │   ├── todo-form-dialog.tsx # 任务表单弹窗
│   │   └── copy-to-dialog.tsx  # 复制任务弹窗
│   ├── lib/                    # 工具函数和逻辑
│   │   ├── db/                 # 数据存储层
│   │   │   ├── index.ts        # 统一存储接口
│   │   │   ├── indexeddb.ts    # IndexedDB 实现
│   │   │   └── storage-fallback.ts # localStorage 降级
│   │   ├── hooks/              # React Hooks
│   │   │   ├── use-todos.ts    # Todo 数据 hooks
│   │   │   └── use-todo-form.ts # 表单 hook
│   │   ├── utils/              # 工具函数
│   │   │   ├── date.ts         # 日期处理
│   │   │   └── todos.ts        # 分组和统计
│   │   └── utils.ts            # 通用工具
│   └── types/                  # TypeScript 类型
│       └── todo.ts             # Todo 类型定义
├── public/                     # 静态资源
├── .env.example                # 环境变量示例
├── components.json             # shadcn/ui 配置
├── next.config.ts              # Next.js 配置
├── tailwind.config.ts          # TailwindCSS 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖
```

## 本地运行

### 方式一：使用 npm

```bash
# 1. 进入项目目录
cd todo-list

# 2. 安装依赖（如果还没安装）
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:3000
```

### 方式二：使用 pnpm

```bash
# 1. 安装 pnpm（如果还没安装）
npm install -g pnpm

# 2. 进入项目目录
cd todo-list

# 3. 安装依赖
pnpm install

# 4. 启动开发服务器
pnpm dev

# 5. 打开浏览器访问
# http://localhost:3000
```

### 方式三：使用 yarn

```bash
# 1. 进入项目目录
cd todo-list

# 2. 安装依赖
yarn install

# 3. 启动开发服务器
yarn dev

# 4. 打开浏览器访问
# http://localhost:3000
```

## 构建生产版本

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build
```

构建完成后，可以预览生产版本：

```bash
# npm
npm start

# pnpm
pnpm start

# yarn
yarn start
```

## 数据存储说明

本项目使用浏览器端存储，数据完全保存在用户浏览器中：

- **首选存储**: IndexedDB（使用 `idb` 库封装）
  - 支持大量数据存储
  - 支持按日期范围索引查询
  - 性能更好

- **降级存储**: localStorage（当 IndexedDB 不可用时）
  - 兼容性更好
  - 数据量受限（约 5MB）

### 清空数据

如需清空所有待办数据，在浏览器控制台执行：

```javascript
// IndexedDB
indexedDB.deleteDatabase('todo-calendar-db')

// localStorage
localStorage.removeItem('todo-calendar-data')
```

或在应用内添加"清空数据"功能（可作为后续增强）。

## Vercel 部署

### 方式一：通过 Vercel Dashboard 部署

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 导入你的 Git 仓库（GitHub/GitLab/Bitbucket）
4. Vercel 会自动检测 Next.js 项目
5. 点击 "Deploy" 开始部署

### 方式二：通过 Vercel CLI 部署

```bash
# 1. 安装 Vercel CLI（如果还没安装）
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel

# 4. 按提示操作即可
```

### 部署配置

本项目无需额外配置，Vercel 会自动使用以下设置：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### 注意事项

1. **环境变量**: 本项目不需要环境变量，无需配置
2. **域名**: 部署完成后，Vercel 会分配一个 `.vercel.app` 域名
3. **自定义域名**: 可在 Vercel Dashboard 的项目设置中添加
4. **自动部署**: 推送代码到 Git 仓库后，Vercel 会自动重新部署

### 构建失败排查

如果部署时构建失败，请检查：

1. **Node.js 版本**: Vercel 默认使用 Node.js 18.x/20.x，可在项目设置中指定
2. **依赖安装**: 确保 `package.json` 中的依赖版本正确
3. **构建日志**: 查看 Vercel 的构建日志了解具体错误
4. **本地构建**: 先在本地运行 `npm run build` 确保可以成功构建

## 功能自检清单

### 核心功能 ✅

- [x] 周视图 7 列展示（周一到周日）
- [x] 顶部统计卡片（已完成/待办/总数/完成率）
- [x] 周选择器（上一周/下一周/今天）
- [x] 任务卡片展示（时间/标题/描述/完成状态）
- [x] 创建任务（标题必填，日期必填，时间可选）
- [x] 编辑任务
- [x] 删除任务
- [x] 切换完成状态
- [x] 按时间排序任务列表
- [x] 隐藏已完成开关

### 移动端适配 ✅

- [x] 横向滑动浏览不同天
- [x] 右下角浮动新建按钮（FAB）
- [x] 响应式布局
- [x] 触摸友好的交互

### 数据存储 ✅

- [x] IndexedDB 实现（含 date 索引）
- [x] 按日期范围查询
- [x] localStorage 降级
- [x] 统一存储接口

### 工程质量 ✅

- [x] TypeScript 类型定义
- [x] Zod 表单验证
- [x] TanStack Query 状态管理
- [x] 错误处理和 Loading 状态
- [x] 空态提示
- [x] 项目结构清晰

### 加分项 ✅

- [x] 复制任务到其他日期
- [x] Toast 通知（sonner）
- [x] React Query Devtools
- [x] 渐变背景
- [x] 暗黑模式支持（通过 shadcn/ui）

## 待增强功能（可选）

以下功能可作为后续增强：

1. **任务标签/分类**: 为任务添加标签进行分类
2. **任务优先级**: 添加高/中/低优先级
3. **任务提醒**: 设置任务提醒时间（需要 Notification API）
4. **月视图**: 切换到月视图查看更长周期
5. **拖拽排序**: 拖拽调整任务顺序或日期
6. **搜索功能**: 搜索特定任务
7. **数据导出**: 导出为 JSON/CSV
8. **数据同步**: 使用云服务同步数据（需要后端）
9. **主题切换**: 更多颜色主题
10. **快捷键**: 键盘快捷键支持

## License

MIT

## 作者

Created with ❤️ using Next.js, TypeScript, and TailwindCSS
