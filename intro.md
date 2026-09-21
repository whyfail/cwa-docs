---
sidebar_position: 1
title: 🚀 快速开始
keywords: [cwa-stack, 开箱即用, 脚手架, vite, React, Vue3, 前端, 前端框架, 前端开发, 前端开发工具]
---

# 🎉 欢迎使用 cwa-stack

## 🚀 什么是 cwa-stack？

cwa-stack 是一款**现代化前端脚手架**，提供 Vite 8 + Rolldown、Next.js 与 Nuxt 模板，旨在为开发者提供**极速、便捷、开箱即用**的项目创建体验。

### ✨ 核心优势

- ⚡ **极速构建**：基于 Rust 驱动的 Vite 8 + Rolldown，构建速度提升 15 倍
- 📦 **开箱即用**：内置完整项目结构，无需复杂配置
- 🎨 **四套模板**：支持 React、Vue 3 的 SPA 与 SSR 项目，覆盖 Vite、Next.js 和 Nuxt
- 🧩 **TypeScript 优先**：React 与 Vue3 模板均已内置 TypeScript 配置
- 🔧 **开发友好**：集成 ESLint、Git 钩子、开发工具等
- 🤖 **AI 友好**：模板内置清晰目录边界和 AGENTS.md 约定，方便 AI Agent 协作开发

## 📋 环境准备

在开始之前，请确保你的设备已安装以下环境：

### ✅ 必备环境

1. **Git** - 版本控制系统
   - 下载地址：[https://git-scm.com/](https://git-scm.com/)
   - 验证方式：`git --version`

2. **Node.js** - JavaScript 运行时
   - 四套模板统一使用 Node.js 24 LTS（Krypton，推荐最新 24.x）
   - `package.json` 支持范围：`>=24.11.0 <25`
   - 直接下载node地址：[https://nodejs.org](https://nodejs.org)
   - 或使用 **nvm-desktop** 管理 Node.js 版本（推荐）
   - 下载地址: [nvm-desktop](https://github.com/1111mp/nvm-desktop)
   - 验证方式：`node --version`

### 🎯 推荐工具

- **Trae** - 智能 IDE (字节出品)
  - 下载地址：[国内版](https://www.trae.cn/)
  - 或 [国际版](https://trae.ai/)
  - 验证方式：`trae --version`

- **Visual Studio Code** - 现代化代码编辑器
  - 下载地址：[https://code.visualstudio.com/](https://code.visualstudio.com/)
  - 推荐插件：ESLint、Tailwind CSS IntelliSense、Volar（Vue 开发）

## 🎉 开始创建项目

### 🚀 步骤 1：初始化项目

打开终端，在你想要创建项目的目录中输入以下命令：

```bash
# 使用 npx 创建项目
npx cwa-stack create
```

### 🎯 步骤 2：选择创建方式、技术栈、应用类型和模板

首问选择创建方式（独立项目 / 全栈组合项目）；独立项目再依次选择技术栈、应用类型和模板：

```
? 请选择创建方式：
❯ 独立项目
  全栈组合项目

? 请选择技术栈：
❯ React
  Vue

? 请选择应用类型：
  单页面应用
❯ SSR 服务端渲染

? 请选择模板：
❯ Next.js React SSR 企业级模板（next-react-ssr）
```

当前模板选项：

| 模板选项 | 渲染方式 | 核心框架 |
| --- | --- | --- |
| `vite-react` | SPA | Vite 8 + React 19 |
| `vite-vue3` | SPA | Vite 8 + Vue 3 |
| `next-react-ssr` | SSR | Next.js 16 + React 19 |
| `nuxt-vue3-ssr` | SSR | Nuxt 4 + Vue 3 |
| `spring-boot` | 后端单体 | Java 25 + Spring Boot 4 |

选择「全栈组合项目」时，只需选择前端技术栈（React / Vue）与渲染模式（SPA / SSR），前端模板随之唯一确定，后端固定为 `spring-boot`：

| 全栈预设 | 前端模板 | 后端模板 | Web 端口 |
| --- | --- | --- | ---: |
| `react-spring` | `vite-react` | `spring-boot` | 5173 |
| `vue-spring` | `vite-vue3` | `spring-boot` | 5173 |
| `next-spring` | `next-react-ssr` | `spring-boot` | 3000 |
| `nuxt-spring` | `nuxt-vue3-ssr` | `spring-boot` | 3000 |

各模板的详细能力说明见「核心能力」文档：[React 模板](/core/React模板)、[Vue3 模板](/core/Vue3模板)、[ReactSSR模板](/core/ReactSSR模板)、[Vue3SSR模板](/core/Vue3SSR模板)、[SpringBoot模板](/core/SpringBoot模板)。

### 📝 步骤 3：填写项目信息

按照提示输入项目名称和项目描述：

```
? 请输入项目名称：my-awesome-app
? 请输入项目描述：一个使用 cwa-stack 创建的现代化前端应用
```

选择 `spring-boot` 后端模板时，会额外询问 Java 包名（例如 `com.mycompany.myapp`），生成时会替换模板中的 `{{ package }}` / `{{ name }}` 占位符。

### 🤖 非交互创建

CI、脚本或 AI Agent 可以通过命令行参数或标准输入创建项目。

独立项目用 `--template`，组合项目用 `--preset`（两者互斥）：

```bash
npx cwa-stack create my-web --template vite-react --description "My web application"
npx cwa-stack create my-api --template spring-boot --package com.example.myapi
npx cwa-stack create my-app --preset react-spring --package com.example.myapp --description "My full-stack application"
```

也可以继续使用标准输入，每行依次传入模板标识、项目名称和可选的项目描述：

```bash
printf '%s\n' 'vite-react' 'my-react-app' 'React SPA 项目' | npx cwa-stack create
```

省略项目描述时只传两行：

```bash
printf '%s\n' 'nuxt-vue3-ssr' 'my-nuxt-app' | npx cwa-stack create
```

管道模式直接使用模板标识，不再询问技术栈和应用类型。模板标识必须是 `vite-react`、`vite-vue3`、`next-react-ssr`、`nuxt-vue3-ssr` 或 `spring-boot`。

`spring-boot` 模板的管道格式多一行 Java 包名：

```bash
printf '%s\n' 'spring-boot' 'my-backend' 'com.mycompany.mybackend' 'Spring Boot 后端服务' | npx cwa-stack create
```

全栈组合使用 `preset:` 前缀的管道格式（Java 包名必填）：

```bash
printf '%s\n' 'preset:react-spring' 'my-app' 'com.example.myapp' '全栈应用' | npx cwa-stack create
```

### 🧬 全栈组合工程

组合创建会生成结构完整、前后端真实联通、可一键启动的全栈工程：

```
my-app/
├── apps/
│   ├── web/                  # 前端模板原样装配（apps/web）
│   └── api/                  # Spring Boot 后端（apps/api，openapi.yaml 为契约来源）
├── docs/                     # 架构与开发说明
├── scripts/                  # setup / dev / verify / doctor / api:generate 编排脚本
├── cwa.config.json           # 机器可读工程清单（目录、端口、契约、命令）
├── AGENTS.md                 # AI 协作规则
└── package.json              # 根级命令入口
```

根级统一命令：

| 命令 | 说明 |
| --- | --- |
| `pnpm run setup` | 环境门禁、冻结安装、生成随机密码 `.env`、生成 OpenAPI Client |
| `pnpm run dev` | 启动 MySQL/Redis、Spring Boot 与前端开发服务器 |
| `pnpm run verify` | 全栈验证：契约漂移、双端门禁、真实登录 E2E |
| `pnpm run doctor` | 只读环境诊断（PASS/WARN/FAIL + 修复建议） |
| `pnpm run api:generate` | 依据 `apps/api/openapi.yaml` 重新生成前端 Client |

组合工程是**单一 Git 仓库**（子项目不携带嵌套 `.git`），前端类型与 Client 由后端契约自动生成，业务代码禁止手工编辑生成目录。详见「核心能力」文档：[脚手架核心](/core/脚手架核心)。

### ⏳ 步骤 4：等待模板下载

模板下载通常只需要**几秒钟**即可完成。

### 📦 步骤 5：进入项目目录

```bash
cd my-awesome-app
```

### 🎯 步骤 6：初始化 Git 仓库

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交初始版本
git commit -m "feat: 初始化项目"
```

### 📦 步骤 7：安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 🚀 步骤 8：启动开发服务器

```bash
# React 模板
pnpm run start

# Vue3 模板
pnpm run dev

# React SSR / Vue 3 SSR 模板
pnpm run dev
```

### 🏗️ 步骤 9：构建生产版本

```bash
# 构建生产版本（秒级构建）
pnpm run build
```

## 🎯 项目结构

创建的项目将包含以下核心结构：

### React 模板结构

```
my-awesome-app/
├── src/
│   ├── app/           # 应用装配、路由、通知、导航、全局样式
│   ├── features/      # 业务功能模块，如 auth、docs
│   ├── shared/        # 跨业务基础能力，如 ui、api、lib、config
│   ├── assets/        # 静态资源
│   ├── utils/         # 独立工具函数
│   ├── main.tsx       # 入口文件
│   └── vite-env.d.ts  # Vite 类型声明
├── AGENTS.md          # AI 协作规则
├── components.json    # shadcn/ui 配置
├── eslint.config.mjs  # ESLint 配置
├── vite.config.js     # Vite 配置
├── tsconfig.json      # TypeScript 配置
└── package.json       # 项目依赖
```

### Vue3 模板结构

```
my-awesome-app/
├── src/
│   ├── app/           # 应用装配、路由、通知、导航、全局样式
│   ├── features/      # 业务功能模块，如 auth、docs
│   ├── shared/        # 跨业务基础能力，如 ui、api、lib、config
│   ├── main.ts        # 入口文件
│   ├── vite-env.d.ts  # Vite 类型声明
│   └── vue-router-meta.d.ts # 路由 meta 类型声明
├── .agents/skills/    # AI Agent 项目技能
├── AGENTS.md          # AI 协作规则
├── components.json    # shadcn-vue 配置
├── eslint.config.mjs  # ESLint 配置
├── vite.config.ts     # Vite 配置
├── tsconfig.json      # TypeScript 配置
└── package.json       # 项目依赖
```

### React SSR 模板结构

```txt
my-awesome-app/
├── src/
│   ├── app/           # Next.js App Router 入口
│   ├── features/      # 业务功能模块
│   ├── shared/        # API、UI、组件和工具函数
│   ├── server/        # 服务端专属能力
│   └── test/          # 测试 setup 与渲染工具
├── tests/e2e/         # Playwright E2E
├── next.config.ts     # Next.js 配置
└── package.json
```

### Vue 3 SSR 模板结构

```txt
my-awesome-app/
├── src/
│   ├── pages/         # Nuxt 文件路由
│   ├── layouts/       # 应用布局
│   ├── features/      # 业务功能模块
│   ├── shared/        # API、UI、组件和工具函数
│   ├── server/        # 服务端专属能力
│   ├── stores/        # Pinia stores
│   └── test/          # 测试 setup 与渲染工具
├── tests/e2e/         # Playwright E2E
├── nuxt.config.ts     # Nuxt 配置
└── package.json
```

## 📚 常用命令

### cwa-stack 命令

| 命令 | 描述 |
| --- | --- |
| `npx cwa-stack create` | 交互式或管道式创建项目 |
| `npx cwa-stack list` | 查看当前可用模板及仓库地址 |
| `npx cwa-stack add` | 向当前安装副本添加自定义模板 |
| `npx cwa-stack delete` | 从当前安装副本删除模板 |
| `npx cwa-stack --version` | 查看 CLI 版本 |

`add` 和 `delete` 修改的是 CLI 当前安装副本中的模板配置；使用一次性 `npx` 时不适合作为持久模板管理方式。

### 模板项目命令

| 命令 | 描述 |
|------|------|
| `pnpm run start` | 启动 React 模板开发服务器 |
| `pnpm run dev` | 启动 Vue3 SPA、React SSR 或 Vue 3 SSR 开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm run preview` | 预览生产构建 |
| `pnpm run lint` | 运行代码规范检查 |
| `pnpm run typecheck` | 四套模板统一的类型检查命令 |

## 🚀 下一步

恭喜你！你已经成功创建了一个使用 cwa-stack 的现代化前端项目。

### 🌟 推荐阅读

- [🎨 脚手架核心](/core/脚手架核心.md) - 了解脚手架的核心功能和技术栈
- [⚛️ React 模板](/core/React模板.md) - 深入了解 React 模板的使用
- [🟢 Vue3 模板](/core/Vue3模板.md) - 深入了解 Vue3 模板的使用
- [🌐 SSR 模板总览](/core/SSR模板.md) - 对比两个 SSR 模板与使用边界
- [⚛️ React SSR 模板](/core/ReactSSR模板.md) - 使用 Next.js App Router 模板
- [🟢 Vue 3 SSR 模板](/core/Vue3SSR模板.md) - 使用 Nuxt 4 模板
- [📖 Vite 8.0 新特性](/log/2026-01-22.md) - 了解 Vite 8.0 + Rolldown 的强大功能

### 🤝 社区支持

- [GitHub 仓库](https://github.com/whyfail/create-wl-app) - 给我们一个 star 支持
- [Issues](https://github.com/whyfail/create-wl-app/issues) - 报告问题或提出建议

---

🎉 **现在，开始你的现代化前端开发之旅吧！**

🚀 快速开发 | 🎨 优雅设计 | ⚡ 极致性能 | 🔧 开发友好
