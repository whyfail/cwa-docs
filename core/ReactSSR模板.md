---
sidebar_position: 6
keywords: [create-wl-app, React, SSR, Next.js, App Router, TypeScript, Tailwind CSS]
---

# React SSR 模板 —— Next.js 企业级基线

`next-react-ssr` 是 create-wl-app 的 React 服务端渲染模板。它基于 Next.js 16 App Router 与 React 19，适合需要首屏 HTML、SEO、服务端请求上下文或 Node.js 部署的项目。

## 核心能力

- **SSR 默认开启**：使用 Next.js App Router，Server Component 是默认组件类型。
- **清晰分层**：路由入口位于 `src/app`，业务代码位于 `src/features`，共享能力位于 `src/shared`。
- **服务端边界**：密钥、请求上下文和特权调用放在 `src/server`，避免进入客户端 bundle。
- **现代 UI**：集成 shadcn/ui、Radix UI、Tailwind CSS 4、Heroicons 和 lucide-react。
- **完整质量门禁**：内置 Vitest、Testing Library、MSW、jest-axe、Playwright、ESLint 和 TypeScript 检查。
- **AI 协作约定**：根目录提供 `AGENTS.md`，明确目录归属、SSR 安全规则和验证命令。

## 技术栈

| 分类 | 方案 |
| --- | --- |
| SSR 框架 | Next.js 16 App Router |
| UI 框架 | React 19 |
| 开发语言 | TypeScript |
| 状态管理 | Zustand |
| UI 与样式 | shadcn/ui、Radix UI、Tailwind CSS 4、Sass |
| API | Axios |
| 测试 | Vitest、Testing Library、MSW、jest-axe、Playwright |
| 工程规范 | Next.js 官方 ESLint flat config、oxfmt、commitlint、simple-git-hooks |

## 快速开始

```bash
npx create-wl-app create

? 请选择技术栈 React
? 请选择应用类型 SSR 服务端渲染
? 请选择模板 Next.js React SSR 企业级模板（next-react-ssr）
```

创建后进入项目并启动开发服务：

```bash
cd <项目名称>
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:3000`。

## 项目结构

```txt
src/
├── app/               # App Router 布局、页面和路由状态
├── features/          # auth、docs 等业务模块
├── shared/            # API、基础组件、UI 和工具函数
├── server/            # server-only 请求上下文和特权调用
└── test/              # Vitest setup 与渲染工具
tests/e2e/             # Playwright E2E 用例
```

## SSR 开发约定

- 默认编写 Server Component，只有交互组件或浏览器能力需要添加 `"use client"`。
- `window`、`document`、`localStorage` 和 `sessionStorage` 不得在服务端渲染路径直接执行。
- 真实登录态优先使用 cookie 或请求头；模板中的浏览器存储仅用于客户端演示。
- 业务请求通过 `src/shared/api` 发起，需要密钥或请求上下文的调用留在 `src/server`。
- 页面文件保持为薄入口，业务 UI 和逻辑放入对应的 `src/features/<name>`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Next.js 开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 启动生产预览服务 |
| `pnpm test` | 运行单元与组件测试 |
| `pnpm test:coverage` | 运行覆盖率门禁 |
| `pnpm test:component-coverage` | 检查组件测试是否齐全 |
| `pnpm typecheck` | 执行 TypeScript 类型检查 |
| `pnpm lint` | 执行代码检查 |
| `pnpm test:e2e` | 运行 Playwright E2E |

## 开发调试开关

默认关闭源码定位功能，可按需开启：

```bash
NEXT_ENABLE_CODE_INSPECTOR=true pnpm dev
```

`NEXT_CODE_INSPECTOR_ACTION` 可设置为 `open`、`copy` 或 `both`。

## 相关资源

- [React SSR 模板仓库](https://github.com/whyfail/vite_react_ssr_init)
- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev/)
- [shadcn/ui 文档](https://ui.shadcn.com/)
