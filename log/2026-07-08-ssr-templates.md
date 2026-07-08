# 2026-07-08 SSR 企业级模板新增

## 更新概览

- 新增 `next-react-ssr` 模板：基于 Next.js App Router、React 19、TypeScript、Tailwind CSS 4，面向 Node SSR 部署。
- 新增 `nuxt-vue3-ssr` 模板：基于 Nuxt 4、Vue 3、Pinia、TypeScript、Tailwind CSS 4，面向 Node SSR 部署。
- `create-wl-app` 新增两个模板选项，并保留原有 `vite-react`、`vite-vue3` SPA 模板。
- `cwa-docs` 新增 SSR 模板说明页，记录模板选择、目录结构、SSR 约束和质量门禁。

## React SSR 模板 (vite_react_ssr_init)

### 核心依赖

| 依赖 | 版本 | 类型 | 影响说明 |
| --- | --- | --- | --- |
| next | 16.2.10 | 新增 | 提供 App Router、Node SSR 构建与 `next start` 生产服务。 |
| react / react-dom | 19.2.7 | 新增 | 对齐现有 React 模板运行时基线。 |
| tailwindcss | 4.3.2 | 新增 | 继续使用 Tailwind 4 作为默认样式表达。 |
| vitest / playwright | 4.1.10 / 1.61.1 | 新增 | 提供单元测试、组件测试、覆盖率和生产预览 E2E。 |

### 模板内容

- 采用 `src/app` 作为 Next App Router 入口，业务代码保留 `features`、`shared`、`server`、`test` 分层。
- 默认包含文档页、登录页、404、错误页、loading、共享布局、API wrapper 和 SSR-safe session 示例。
- `AGENTS.md` 明确约束：服务端渲染路径不得直接访问浏览器 API；新增或修改组件必须同步增加组件测试。

## Vue SSR 模板 (vite_vue3_ssr_init)

### 核心依赖

| 依赖 | 版本 | 类型 | 影响说明 |
| --- | --- | --- | --- |
| nuxt | 4.4.8 | 新增 | 提供 Vue SSR、Nitro Node server 和 `nuxt preview` 生产预览。 |
| vue | 3.5.39 | 新增 | 对齐现有 Vue3 模板运行时基线。 |
| pinia / @pinia/nuxt | 3.0.4 / 0.11.3 | 新增 | 提供 Nuxt SSR 场景下的状态管理注册。 |
| tailwindcss / @tailwindcss/vite | 4.3.2 / 4.3.2 | 新增 | 使用 Tailwind 4 的 Vite 插件接入 Nuxt 构建。 |

### 模板内容

- 采用 Nuxt 约定式 `src/pages` 路由，保留 `features`、`shared`、`server`、`stores`、`test` 分层。
- 默认包含文档页、登录页、错误页、默认布局、API wrapper、Pinia 示例和 SSR-safe session 示例。
- Vue 模板内避免使用会被 create-wl-app Handlebars 误处理的 mustache 插值，动态展示优先使用 `v-text`。

## 脚手架更新

`create-wl-app/template.json` 新增：

```json
{
  "next-react-ssr": "https://gitee.com/whyfail/vite_react_ssr_init.git",
  "nuxt-vue3-ssr": "https://gitee.com/whyfail/vite_vue3_ssr_init.git"
}
```

## 验证结果

- React SSR 模板：
  - `pnpm install` 通过。
  - `pnpm test` 通过，9 个测试文件、15 个测试。
  - `pnpm test:coverage` 通过，全局 statements 93.02%。
  - `pnpm test:component-coverage` 通过，覆盖 5 个组件。
  - `pnpm typecheck`、`pnpm lint`、`pnpm build`、`pnpm test:e2e` 均通过。
- Vue SSR 模板：
  - `pnpm install` 通过。
  - `pnpm test` 通过，7 个测试文件、12 个测试。
  - `pnpm test:coverage` 通过，全局 statements 83.33%。
  - `pnpm test:component-coverage` 通过，覆盖 4 个组件。
  - `pnpm typecheck`、`pnpm lint`、`pnpm build`、`pnpm test:e2e` 均通过。

## 注意事项

- 本地验证环境 Node 为 24.1.0，模板声明的 Node engine 为 `^22.12.0 || ^24.11.0 || >=26.0.0`，因此本地命令会出现 engine warning；CI 使用 Node 24，发布使用者应使用满足 engine 的 Node 版本。
- Nuxt 构建和 E2E 中存在 Tailwind/Vite sourcemap warning，不影响构建产物和模板使用。
- SSR 第一版只支持 Node SSR，不包含 SSG、Edge 或 Serverless adapter。
