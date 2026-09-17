---
sidebar_position: 3
keywords: [create-wl-app, 开箱即用, 脚手架, vite, React, Vue3, 前端, 前端框架, 前端开发, 前端开发工具]
---

# 🚀 React 模板 —— 为 AI 而生的企业级项目模板

[![小磊丶同学/vite_react_init](https://gitee.com/whyfail/vite_react_init/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b)](https://gitee.com/whyfail/vite_react_init)

## 🌟 核心优势

- ✅ **AI 友好** - 内置 AGENTS.md 与 docs 入口，方便 AI Agent 快速理解项目边界
- ✅ **企业级分层** - `app`、`features`、`shared` 分层清晰，默认避免业务代码散落
- ⚡ **极致性能** - 基于 Vite 8.3.0 + Rolldown，构建速度飞起来
- 🎨 **现代化 UI 栈** - 使用 shadcn/ui + Tailwind CSS + Heroicons 组织界面能力
- 🔧 **开发友好** - 内置路由守卫、认证 session、API 封装、通知适配和代码规范

## 🛠️ 技术栈亮点

### 🔌 核心框架
- **React 19.3** - 稳定版 React 基线，带来并发渲染和自动批处理
- **Vite 8.3.0** - 下一代前端构建工具，基于 Rolldown 引擎
- **TypeScript** - 默认使用 TS/TSX 组织源码，提供更清晰的类型约束和编辑器提示
- **React Router DOM 7** - 使用 HashRouter 与集中式路由配置，支持 `title`、`needLogin` 等路由 meta

### ⚡ Vite 8.3 构建基线

- **入口配置更统一** - 新增顶层 `input`，插件解析后的入口会自动进入开发服务器文件白名单；模板仍使用标准 `index.html`，无需改动现有配置。
- **开发反馈更清晰** - bundled dev 改进 worker HMR、重建 reload 和终端错误输出；网络地址会标记对应网卡接口，方便局域网联调。
- **配置问题更易定位** - 原生配置加载兼容警告包含列号，并减少虚拟模块误报，复杂插件配置发生问题时可以更快找到具体位置。
- **构建边缘场景更稳健** - 修复 CSS chunk import map、PostCSS 注入内容 URL、优化依赖 interop、非根 `base` 模块图和符号链接根目录等问题。
- **依赖扫描减少无效工作** - 优先检查主流包管理器锁文件，并在忽略相关警告时跳过不必要的配置兼容检查；实际加速幅度取决于项目规模。

当前模板的 React、Tailwind CSS、legacy、压缩、DevTools 与 code-inspector 插件组合已通过生产构建和 Playwright E2E。完整变更与模板验证见 [2026-08-06 升级日志](../log/2026-08-06.md#vite-820-主要提升)。

### 🎯 状态管理
- **zustand** - 轻量级状态管理库，API简洁，性能卓越
  - 无需样板代码，轻松管理全局状态
  - 支持中间件，如持久化存储、DevTools等
  - 完美支持TypeScript

### 🎨 UI 与样式
- **shadcn/ui** - 基础组件统一放在 `src/shared/ui`，业务组件留在各自 feature
- **Tailwind CSS 4** - 默认样式表达方式，替代旧 UnoCSS 配置
- **Heroicons** - 从 `@heroicons/react` 按需导入 SVG 图标，并使用 Tailwind 控制尺寸和颜色
- **Radix UI** - 作为 shadcn 复杂交互组件的无障碍底层能力

### 🔄 网络请求
- **axios** - 统一封装在 `src/shared/api/http.ts`，负责 token 注入、响应解包和错误处理
- **ahooks** - 阿里出品的高质量React Hooks库
  - `useRequest` - 强大的异步数据管理Hook
  - 支持自动请求、防抖、节流、重试等
  - 内置加载状态管理

### 🧭 默认模块
- **auth** - 登录页、session token 读写和认证相关接口
- **docs** - 登录后的默认入口，用于说明项目结构、核心库职责和开发约定
- **app/navigation** - 统一处理未授权跳转和登录过期逻辑
- **app/notifications** - 封装 toast 通知，业务代码不直接依赖第三方实现

### 🛠️ 开发工具
- **code-inspector-plugin** - 浏览器到IDE的一键跳转
  - 按住`shift + alt`点击元素，直接打开对应组件代码
  - 支持VSCode、WebStorm、Trae等主流IDE
- **ESLint** - 代码质量检查，确保代码规范
- **TypeScript** - 提交前可运行 `pnpm exec tsc --noEmit` 进行类型检查
- **simple-git-hooks** - Git钩子，提交前自动检查代码


## 🚀 快速开始

运行时统一使用 Node.js 24 LTS（Krypton），支持范围为 `>=24.11.0 <25`，推荐使用最新 24.x。

```bash
# 创建项目
npx create-wl-app create

? 请选择技术栈
❯ React
  Vue

? 请选择应用类型
❯ 单页面应用
  SSR 服务端渲染

? 请选择模板
❯ Vite React 企业级模板（vite-react）

? 请输入项目名称 my-react-app

? 请输入项目描述 一个基于React的现代化项目模板

✔ 项目生成中...

项目生成成功

# 进入项目目录
cd my-react-app

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run start

# 构建生产版本
pnpm run build
```

## 📋 兼容性说明

- **浏览器支持** - 基于`@vitejs/plugin-legacy`配置，支持主流浏览器
- **CSS兼容性** - 自动添加浏览器前缀，确保跨浏览器一致性
- **响应式设计** - 完美适配移动端、平板和桌面端

## 💡 最佳实践

1. **组件设计** - 遵循单一职责原则，组件化开发
2. **状态管理** - 优先使用 React Hooks，模块级复杂状态放在 `features/<module>/store`
3. **网络请求** - 业务接口通过 shared API wrapper 调用，避免页面里散落 raw axios
4. **样式开发** - 默认使用 Tailwind CSS；全局样式只放 `src/app/styles`
5. **AI 协作** - 项目规则写入 AGENTS.md，新增模块时先保持目录归属清晰
6. **类型与代码规范** - 遵循 TypeScript 和 ESLint 规则，提交前自动检查

## 📁 TypeScript 项目结构

```
src/
├── app/               # 应用装配、路由、通知、导航、全局样式
├── features/          # 业务功能模块，如 auth、docs
├── shared/            # 跨业务基础能力，如 ui、api、lib、config
├── assets/            # 静态资源
├── utils/             # 独立工具函数
├── main.tsx           # 应用渲染入口
└── vite-env.d.ts      # Vite 与静态资源类型声明
```

## ✅ 类型检查

React 模板源码默认使用 TS/TSX，核心目录包括 `src/app`、`src/features`、`src/shared`。提交前建议执行：

```bash
pnpm exec tsc --noEmit
pnpm run lint
```

## 📚 文档资源

- [项目地址](https://github.com/whyfail/vite_react_init)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Heroicons 文档](https://github.com/tailwindlabs/heroicons)
- [ahooks文档](https://ahooks.js.org/zh-CN/)
- [zustand文档](https://zustand-demo.pmnd.rs/)

---

🎉 **立即使用create-wl-app，开启你的现代化React开发之旅！**

🤖 AI 友好 | ⚡ 极致性能 | 🎨 现代 UI | 🔧 开发友好
