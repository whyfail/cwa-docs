---
sidebar_position: 7
keywords: [create-wl-app, Vue3, SSR, Nuxt, Pinia, TypeScript, Tailwind CSS]
---

# Vue 3 SSR 模板 —— Nuxt 企业级基线

`nuxt-vue3-ssr` 是 create-wl-app 的 Vue 服务端渲染模板。它基于 Nuxt 4 与 Vue 3，适合需要首屏 HTML、SEO、服务端请求上下文或 Node.js 部署的项目。

## 核心能力

- **SSR 默认开启**：使用 Nuxt 文件路由、布局和 Nitro 服务端能力。
- **清晰分层**：页面位于 `src/pages`，业务代码位于 `src/features`，共享能力位于 `src/shared`。
- **服务端边界**：密钥、请求上下文和特权调用放在 `src/server`，避免进入客户端 bundle。
- **现代 UI**：集成 shadcn-vue、reka-ui、Tailwind CSS 4、Heroicons 和 Lucide Vue。
- **状态管理**：内置 Pinia 与 `@pinia/nuxt`。
- **完整质量门禁**：内置 Vitest、Testing Library Vue、MSW、jest-axe、Playwright、Oxlint、ESLint 和 Nuxt 类型检查。
- **AI 协作约定**：根目录提供 `AGENTS.md`，明确目录归属、SSR 安全规则和验证命令。

## 技术栈

| 分类 | 方案 |
| --- | --- |
| SSR 框架 | Nuxt 4 |
| UI 框架 | Vue 3 |
| 开发语言 | TypeScript |
| 状态管理 | Pinia、@pinia/nuxt |
| UI 与样式 | shadcn-vue、reka-ui、Tailwind CSS 4、Sass |
| API | Axios |
| 测试 | Vitest、Testing Library Vue、MSW、jest-axe、Playwright |
| 工程规范 | Oxlint、ESLint、oxfmt、commitlint、simple-git-hooks |

## 快速开始

```bash
npx create-wl-app create

? 请选择技术栈 Vue
? 请选择应用类型 SSR 服务端渲染
? 请选择模板 Nuxt Vue 3 SSR 企业级模板（nuxt-vue3-ssr）
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
├── pages/             # Nuxt 文件路由入口
├── layouts/           # 应用布局
├── features/          # auth、docs 等业务模块
├── shared/            # API、基础组件、UI 和工具函数
├── server/            # server-only 与 Nitro 相关能力
├── stores/            # Pinia stores
└── test/              # Vitest setup 与渲染工具
tests/e2e/             # Playwright E2E 用例
```

## SSR 开发约定

- 浏览器专属行为放在 `.client` 插件、`onMounted`，或使用 `import.meta.client` 显式保护。
- `window`、`document`、`localStorage` 和 `sessionStorage` 不得在服务端渲染路径直接执行。
- 真实登录态优先使用 cookie 或请求头；模板中的浏览器存储仅用于客户端演示。
- 业务请求通过 `src/shared/api` 发起，需要密钥或请求上下文的调用留在 `src/server`。
- `src/pages` 中的页面保持为薄入口，业务 UI 和逻辑放入对应的 `src/features/<name>`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Nuxt 开发服务器 |
| `pnpm build` | 构建生产版本，产物输出到 `.output` |
| `pnpm preview` | 启动生产预览服务 |
| `pnpm test` | 运行单元与组件测试 |
| `pnpm test:coverage` | 运行覆盖率门禁 |
| `pnpm test:component-coverage` | 检查组件测试是否齐全 |
| `pnpm typecheck` | 执行 Nuxt 类型检查 |
| `pnpm lint` | 执行 Oxlint 与 ESLint 检查 |
| `pnpm test:e2e` | 运行 Playwright E2E |

## 开发调试开关

默认关闭源码定位功能，可按需开启：

```bash
NUXT_ENABLE_CODE_INSPECTOR=true pnpm dev
```

`NUXT_CODE_INSPECTOR_ACTION` 可设置为 `open`、`copy` 或 `both`。

## 相关资源

- [Vue 3 SSR 模板仓库](https://github.com/whyfail/vite_vue3_ssr_init)
- [Nuxt 文档](https://nuxt.com/docs)
- [Vue 3 文档](https://vuejs.org/)
- [shadcn-vue 文档](https://www.shadcn-vue.com/)
