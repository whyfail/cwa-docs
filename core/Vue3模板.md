---
sidebar_position: 4
keywords: [create-wl-app, 开箱即用, 脚手架, vite, React, Vue3, 前端, 前端框架, 前端开发, 前端开发工具]
---

# 🚀 Vue3 模板 —— 为 AI 而生的企业级项目模板

[![小磊丶同学/vite_vue3_init](https://gitee.com/whyfail/vite_vue3_init/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b)](https://gitee.com/whyfail/vite_vue3_init)

## 🌟 核心优势

- ✅ **AI 友好** - 内置 AGENTS.md、docs 模块和 shadcn-vue skill，方便 AI Agent 快速理解项目边界
- ✅ **企业级分层** - `app`、`features`、`shared` 分层清晰，默认避免业务代码散落
- ⚡ **极致性能** - 基于 Vite 8 + Rolldown，构建速度飞起来
- 🎨 **现代化 UI 栈** - 使用 shadcn-vue + Tailwind CSS + Heroicons 组织界面能力
- 🔧 **开发友好** - 内置路由守卫、认证 session、API 封装、通知适配和代码规范

## 🛠️ 技术栈亮点

### 🔌 核心框架

- **Vue 3.5** - 使用 Composition API 与 `<script setup lang="ts">` 作为默认组件范式
- **Vite 8** - 下一代前端构建工具，基于 Rolldown 引擎，速度飙升
- **TypeScript** - 默认使用 `.ts` 与 Vue SFC 类型检查，提供更清晰的类型约束
- **Vue Router 5** - feature 暴露 routes，由 `src/app/routes` 聚合

### 🎯 状态管理

- **Pinia** - Vue 官方推荐状态管理库，应用级注册位于 `src/app/stores`
- **pinia-plugin-persistedstate** - 支持 session 等状态持久化能力

### 🎨 UI 与样式

- **shadcn-vue** - 基础组件源码统一放在 `src/shared/ui`，业务组件留在各自 feature
- **Tailwind CSS 4** - 默认样式表达方式，替代旧 UnoCSS 配置
- **Heroicons Vue** - 从 `@heroicons/vue/24/outline` 按需导入业务图标
- **reka-ui** - 作为 shadcn-vue 复杂交互组件的无障碍底层能力
- **vue-sonner** - Toast 通知组件，业务侧通过 `src/app/notifications` 调用

### 🔄 网络请求

- **axios** - 统一封装在 `src/shared/api/http.ts`，负责 token 注入、响应解包和错误处理
- **app/navigation** - 统一处理未授权跳转和登录过期逻辑
- **features/auth/session** - token 读写只从认证模块边界进入

### 🧭 默认模块

- **auth** - 登录页、OGL 背景、session token 读写和认证相关接口
- **docs** - 登录后的默认入口，用于说明项目结构、核心库职责和开发约定
- **shared/ui** - shadcn-vue primitives，只放基础组件，不放业务逻辑
- **.agents/skills/shadcn-vue** - 内置 shadcn-vue Agent skill，提升 AI 操作组件时的稳定性

### 🛠️ 开发工具

- **vite-plugin-vue-devtools** - 通过 `VITE_ENABLE_VUE_DEVTOOLS=true` 开启 Vue DevTools 插件
- **@vitejs/devtools** - 通过 `VITE_ENABLE_DEVTOOLS=true` 开启 Vite DevTools
- **code-inspector-plugin** - 通过 `VITE_ENABLE_CODE_INSPECTOR=true` 开启浏览器到 IDE 的代码定位
- **ESLint + vue-tsc** - 提交前建议执行 lint、typecheck 和 build 三道验证

## 🚀 快速开始

```bash
# 创建项目
npx create-wl-app create

? 请选择技术栈
  React
❯ Vue

? 请选择应用类型
❯ 单页面应用
  SSR 服务端渲染

? 请选择模板
❯ Vite Vue 3 企业级模板（vite-vue3）

? 请输入项目名称 my-vue3-app

? 请输入项目描述 一个基于 Vue3 的企业级项目模板

✔ 项目生成中...

项目生成成功

# 进入项目目录
cd my-vue3-app

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build
```

## 💡 最佳实践

1. **模块归属** - 新业务放到 `src/features/<name>`，页面、组件、接口和 store 跟随 feature
2. **应用组合** - 路由、通知、导航、全局样式和全局 store 注册放在 `src/app`
3. **共享能力** - 跨业务 API、工具函数、运行配置和基础组件放在 `src/shared`
4. **样式开发** - 默认使用 Tailwind CSS；全局样式只放 `src/app/styles`
5. **AI 协作** - 项目规则写入 AGENTS.md，新增目录前先确认业务或能力归属
6. **质量验证** - 提交前执行 `pnpm lint`、`pnpm typecheck`、`pnpm build`

## 📁 TypeScript 项目结构

```txt
src/
├── app/                  # 应用装配、路由、通知、导航、全局样式
│   ├── routes/           # 路由聚合、守卫、类型
│   ├── stores/           # 全局状态注册
│   ├── styles/           # Tailwind 与全局样式
│   ├── App.vue
│   └── setup.ts
├── features/             # 业务功能模块
│   ├── auth/             # 登录、session、认证接口
│   └── docs/             # 模板文档页
├── shared/               # 跨业务基础能力
│   ├── api/              # HTTP client
│   ├── components/       # 非 shadcn 的共享组件
│   ├── config/           # 运行配置
│   ├── lib/              # 工具函数
│   └── ui/               # shadcn-vue primitives
├── main.ts
└── vite-env.d.ts
```

## ⚙️ 环境变量

```txt
VITE_APP_NAME="初始化项目"
VITE_API_BASE="/API_BASE"
VITE_API_TARGET="http://xxxx"
VITE_ENABLE_VUE_DEVTOOLS=true
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_CODE_INSPECTOR=false
VITE_ENABLE_COMPRESSION=true
VITE_ENABLE_LEGACY=true
VITE_ENABLE_WEB_UPDATE_NOTICE=false
```

## 🧩 shadcn-vue

配置文件为 `components.json`。添加组件时使用：

```bash
pnpm dlx shadcn-vue@latest add button card
```

组件默认生成到 `src/shared/ui`，工具函数使用 `src/shared/lib/utils.ts`。

## ✅ 类型检查

Vue3 模板源码默认使用 TypeScript，核心目录包括 `src/app`、`src/features`、`src/shared`。提交前建议执行：

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

## 📚 文档资源

- [GitHub 项目地址](https://github.com/whyfail/vite_vue3_init)
- [Gitee 项目地址](https://gitee.com/whyfail/vite_vue3_init)
- [Vue 3 官方文档](https://vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [shadcn-vue 文档](https://www.shadcn-vue.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Heroicons 文档](https://github.com/tailwindlabs/heroicons)
- [Vite 官方文档](https://vite.dev/)

---

🎉 **立即使用 create-wl-app，开启你的现代化 Vue3 企业级开发之旅！**

🤖 AI 友好 | ⚡ 极致性能 | 🎨 现代 UI | 🔧 开发友好
