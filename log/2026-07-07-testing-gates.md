# 2026-07-07 测试质量门禁升级

## 更新概览

- React 模板和 Vue3 模板同步补齐企业级测试基础设施：Vitest、覆盖率门禁、组件测试守卫、MSW、无障碍测试、Playwright E2E 和 GitHub Actions CI。
- README.md 与 AGENTS.md 同步补充测试约束：新增或修改组件时必须同步新增或更新组件测试，每个组件至少保留一个 render/mount 冒烟测试。
- 本次升级不改变模板运行时业务逻辑；主要提升后续模板升级、AI 协作开发和 PR 合并前的自动化验证能力。

## React 模板 (vite_react_init)

### 新增测试与工程能力

| 类型 | 内容 | 影响说明 |
| --- | --- | --- |
| 测试框架 | Vitest + jsdom + Testing Library | 支持 React 组件测试、业务逻辑单测和页面级测试。 |
| 覆盖率门禁 | `@vitest/coverage-v8`，全局阈值 70% | 防止核心逻辑和组件测试覆盖率持续退化。 |
| 组件测试守卫 | `scripts/check-component-tests.js` | 检查新增或修改组件是否被测试覆盖，避免组件只改不测。 |
| 网络 Mock | MSW | API wrapper 和业务接口测试不再依赖真实后端。 |
| 无障碍测试 | `jest-axe` | 对登录页和文档页增加基础 a11y 扫描。 |
| E2E 测试 | Playwright Chromium | 覆盖未登录跳转、登录进入文档页和 404 fallback 等关键路径。 |
| CI | `.github/workflows/ci.yml` | push / pull_request 时自动执行安装、测试、覆盖率、类型、lint、E2E 和构建。 |
| 报告产物 | `coverage/`、`test-results/`、`playwright-report/` | 本地和 CI 可定位测试、覆盖率与 E2E 失败原因。 |

### 文档与脚本变化

- `package.json` 新增 `test`、`test:coverage`、`test:junit`、`test:watch`、`test:ui`、`test:e2e`、`test:e2e:ui`、`test:component-coverage` 和 `typecheck`。
- `lint` 改为非破坏性检查：`eslint . --cache`；新增 `lint:fix` 用于显式修复。
- `vite.config.js` 新增 Vitest 配置、覆盖率阈值和测试环境下重型插件跳过逻辑。
- `AGENTS.md` 和 `README.md` 明确组件测试约束、验证命令和报告目录。
- `pnpm-lock.yaml` 重新生成，用于锁定新增测试依赖版本。

### 模板影响

- WebGL 登录背景组件保留 render smoke test，但从覆盖率门禁中排除；这类视觉动画组件更适合通过组件冒烟和 E2E 验证，不强行用行覆盖率凑数字。
- Playwright E2E 使用 production build + preview 验证模板真实构建产物，覆盖登录与文档页主路径。
- 未发现需要模板使用者调整业务代码的破坏性变更。

## Vue3 模板 (vite_vue3_init)

### 新增测试与工程能力

| 类型 | 内容 | 影响说明 |
| --- | --- | --- |
| 测试框架 | Vitest + jsdom + Vue Test Utils + Testing Library | 支持 Vue SFC mount 测试、业务逻辑单测和页面级测试。 |
| 覆盖率门禁 | `@vitest/coverage-v8`，全局阈值 70% | 为 Vue 组件、API wrapper 和业务逻辑提供基础覆盖率约束。 |
| 组件测试守卫 | `scripts/check-component-tests.js` | 扫描 `app`、`features`、`shared/components` 和 `shared/ui` 下的 Vue 组件测试覆盖情况。 |
| 网络 Mock | MSW | 登录接口和 HTTP client 测试可在本地稳定复现。 |
| 无障碍测试 | `jest-axe` | 对登录页和文档页增加基础 a11y 扫描。 |
| E2E 测试 | Playwright Chromium | 覆盖首页文档、登录跳转和 404 fallback。 |
| CI | `.github/workflows/ci.yml` | push / pull_request 时自动执行完整质量门禁。 |
| 报告产物 | `coverage/`、`test-results/`、`playwright-report/` | 方便定位覆盖率、单测和 E2E 问题。 |

### 文档与源码变化

- `package.json` 新增测试脚本、E2E 脚本和组件测试守卫脚本。
- `vite.config.ts` 新增 Vitest 配置、覆盖率阈值和测试环境下重型插件跳过逻辑。
- `AGENTS.md` 和 `README.md` 明确组件测试约束、验证命令和报告目录。
- `DocsPage.vue` 的 `CardTitle` 改为 `as="h2"`，修复文档页 heading 顺序的 a11y 问题。
- `CardTitle.vue` 新增 `as?: "h2" | "h3"`，保持默认 `h3`，文档页可按语义层级覆盖标题标签。
- `ErrorBoundary.vue` 仅经过 formatter 调整 `</pre>` 换行，不改变运行时行为。

### 模板影响

- 新增测试依赖和锁文件更新只影响开发、CI 和验证链路，不改变模板生产功能。
- Vue 模板保留 `format` / `format:check`，README 中同步补充完整测试链路。
- 未发现需要模板使用者调整现有业务代码的破坏性变更。

## 验证结果

### React 模板

- `npx pnpm@11.10.0 install`：通过。
- `npx pnpm@11.10.0 test:coverage`：通过，覆盖率 summary 为 statements 79.52%、branches 74.31%、functions 74.5%、lines 81.74%。
- `npx pnpm@11.10.0 test:component-coverage`：通过，组件测试守卫覆盖 19 个真实组件。
- `npx pnpm@11.10.0 typecheck`：通过。
- `npx pnpm@11.10.0 lint`：通过。
- `npx pnpm@11.10.0 build`：通过。
- `npx pnpm@11.10.0 test:e2e`：通过，3 个 Playwright 用例全部通过。
- `npx pnpm@11.10.0 peers check --json`：通过，无 bad、missing、conflicts。

### Vue3 模板

- `npx pnpm@11.10.0 install`：通过。
- `npx pnpm@11.10.0 test:coverage`：通过，覆盖率 summary 为 statements 79.22%、branches 78.35%、functions 71.95%、lines 79.53%。
- `npx pnpm@11.10.0 test:component-coverage`：通过，组件测试守卫覆盖 19 个组件。
- `npx pnpm@11.10.0 typecheck`：通过。
- `npx pnpm@11.10.0 lint`：通过。
- `npx pnpm@11.10.0 format:check`：通过。
- `npx pnpm@11.10.0 build`：通过。
- `npx pnpm@11.10.0 test:e2e`：通过，3 个 Playwright 用例全部通过。
- `npx pnpm@11.10.0 peers check --json`：通过，无 bad、missing、conflicts。

## 注意事项

- CI 失败时，应优先查看失败命令对应日志；本次已预留 `coverage/`、`test-results/`、`playwright-report/` 作为报告目录。
- 当前 CI 已生成 JUnit 和覆盖率报告，但尚未上传 GitHub Actions artifacts；后续可补充 `actions/upload-artifact` 方便 PR 失败后下载报告。
- 组件测试守卫用于保证“组件至少有测试覆盖”，复杂业务组件仍应继续补充关键交互和异常路径测试。
- Playwright 当前默认 Chromium 桌面端冒烟测试；后续可扩展移动端视口和失败截图/视频保留策略。
