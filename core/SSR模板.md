---
sidebar_position: 5
keywords: [create-wl-app, SSR, Next.js, Nuxt, React, Vue3, 企业级模板, 前端脚手架]
---

# 🚀 SSR 模板 —— Next.js 与 Nuxt 企业级基线

create-wl-app 新增两个独立 SSR 模板：

- `next-react-ssr`：基于 Next.js App Router、React 19、TypeScript、Tailwind CSS 4。
- `nuxt-vue3-ssr`：基于 Nuxt 4、Vue 3、TypeScript、Pinia、Tailwind CSS 4。

两个 SSR 模板不替换现有 SPA 模板，适合需要首屏 HTML、Node SSR 部署、SEO 或服务端请求上下文的项目。

## 🌟 核心约束

- **独立模板**：SSR 模板与 `vite-react`、`vite-vue3` 并存，不影响现有 SPA 用户。
- **企业级分层**：路由入口使用框架约定，业务仍按 `features`、`shared`、`server`、`test` 分层。
- **SSR 安全**：服务端渲染路径不得直接访问 `window`、`document`、`localStorage`、`sessionStorage`。
- **测试门禁**：内置 Vitest、组件测试覆盖检查、覆盖率阈值、jest-axe、Playwright E2E 和 CI。
- **Node SSR**：第一版聚焦 Node 部署，不内置 SSG、Edge 或 Serverless adapter。

## 🧭 模板选择

```bash
npx create-wl-app create

? 请选择模板
  vite-react
  vite-vue3
❯ next-react-ssr
  nuxt-vue3-ssr
```

## 📁 项目结构

```txt
src/
├── app 或 pages/       # Next App Router 或 Nuxt pages
├── layouts/            # Nuxt 布局，仅 Vue SSR 模板使用
├── features/           # 业务功能模块
├── shared/             # API、组件、UI、工具函数
├── server/             # 服务端专属能力
├── stores/             # Pinia store，仅 Vue SSR 模板使用
└── test/               # 测试 setup 与渲染工具
tests/e2e/              # Playwright 生产预览 E2E
```

## ✅ 质量门禁

两个 SSR 模板都提供以下命令：

```bash
pnpm test
pnpm test:coverage
pnpm test:component-coverage
pnpm typecheck
pnpm lint
pnpm test:e2e
pnpm build
```

组件测试规则与 SPA 模板一致：新增或修改任何组件时，必须同步新增或更新组件测试；每个组件至少有一个 render/mount 冒烟测试。

## ⚠️ SSR 开发注意事项

- React SSR 模板默认使用 Server Component，只有交互组件才加 `"use client"`。
- Vue SSR 模板的浏览器专属逻辑应放在 `.client` 插件、`onMounted` 或显式客户端判断中。
- 真实登录态建议使用 cookie 或请求头；模板内的 localStorage/sessionStorage 只作为客户端演示。
- E2E 针对生产预览服务运行，确保构建、服务端渲染、hydration 和路由跳转一起被验证。

## 📚 项目地址

- [React SSR 模板](https://github.com/whyfail/vite_react_ssr_init)
- [Vue SSR 模板](https://github.com/whyfail/vite_vue3_ssr_init)
