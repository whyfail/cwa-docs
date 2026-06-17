# 2026-06-17 Oxlint / Oxfmt 工具链改造

## 更新概览

- Vue3 模板将代码检查工具从 ESLint 切换为 Oxlint，将格式化能力独立为 Oxfmt。
- 新增 `.oxlintrc.json` 和 `.oxfmtrc.json`，删除旧的 `eslint.config.mjs`。
- `pnpm lint` 保持作为质量门禁入口，新增 `pnpm lint:fix`、`pnpm format` 和 `pnpm format:check`。
- `lint-staged` 改为对 JS/TS/Vue 文件执行 Oxlint fix，并对常见源码、样式、文档和配置文件执行 Oxfmt。
- 修复 `.npmrc` 中 npm 不识别的 `ignore-trust-checks` 配置，避免执行 `npm run dev` 时出现无关 warning。

## Vue3 模板 (vite_vue3_init)

### 工具链调整

- 新增 `oxlint@^1.70.0` 和 `oxfmt@^0.55.0`。
- 移除项目直接依赖的 `eslint`、`@antfu/eslint-config`、`@stylistic/eslint-plugin` 和 `eslint-plugin-format`。
- Oxlint 启用 `typescript`、`unicorn`、`oxc`、`vue` 和 `import` 插件，并忽略 `node_modules`、`dist`、`public`、`.agents`、`.trae`。
- Oxfmt 忽略 `node_modules`、`dist`、`public`、`.agents`、`.trae` 和 `pnpm-lock.yaml`，避免格式化生成物、静态资源和锁文件。
- 首次接入时执行 `pnpm format`，让模板源码统一收敛到 Oxfmt 默认格式。

### 脚本与提交检查

- `pnpm lint`：执行 Oxlint 检查，并通过 `--deny-warnings` 保持严格门禁。
- `pnpm lint:fix`：执行 Oxlint 自动修复。
- `pnpm format`：执行 Oxfmt 写入格式化。
- `pnpm format:check`：执行 Oxfmt 格式检查。
- `lint-staged` 继续作为 pre-commit 入口，提交前自动处理暂存文件。

### 兼容性处理

- Oxlint 的 Vue 能力主要覆盖 SFC 脚本和部分 Vue 规则，不再尝试 1:1 复刻 `eslint-plugin-vue` 的全部 template 检查。
- 原 ESLint stylistic 规则不再保留，统一由 Oxfmt 负责格式化风格。
- `tsconfig.json` 显式增加 `noEmit: true`，避免 `pnpm typecheck` 在源码目录旁生成 `.js` 派生文件。
- `pnpm-lock.yaml` 中仍能看到 `eslint` 相关传递依赖，来源是 `shadcn-vue -> vue-metamorph` 的工具链依赖，并非模板自身的 lint 入口。

## 验证结果

- `pnpm install`：通过。
- `pnpm lint`：通过。
- `pnpm lint:fix`：通过。
- `pnpm format:check`：通过。
- `pnpm typecheck`：通过。
- `pnpm build`：通过；构建中仍存在 VueUse `#__PURE__` 注释位置提示，属于第三方依赖产物提示，不阻塞构建。
- `pnpm exec lint-staged --diff=HEAD --no-stash`：通过。
- `npm run`：不再出现 `Unknown project config "ignore-trust-checks"` warning。

## 注意事项

- Vue3 模板后续新增代码时，建议使用 `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build` 作为提交前完整验证。
- 如需自动修复和格式化，可先执行 `pnpm lint:fix && pnpm format`。
- 由于 Oxlint 和 Oxfmt 仍在快速迭代，后续升级时需要关注 Vue SFC template 检查能力和格式化配置项的变化。
