<div align="center">

# cwa-docs

**[cwa-stack](https://github.com/whyfail/cwa-stack) 官方文档站** —— 契约驱动 · 开箱即验证 · AI 原生

[![npm version](https://img.shields.io/npm/v/cwa-stack.svg)](https://www.npmjs.com/package/cwa-stack)
[![docs](https://img.shields.io/badge/docs-whyfail.github.io%2Fcwa--docs-blue)](https://whyfail.github.io/cwa-docs/)
[![GitHub repo](https://img.shields.io/badge/GitHub-whyfail%2Fcwa--stack-blue)](https://github.com/whyfail/cwa-stack)
[![license](https://img.shields.io/npm/l/cwa-stack.svg)](https://www.npmjs.com/package/cwa-stack)

**一条命令，全栈成型。**

</div>

---

这是 [cwa-stack](https://github.com/whyfail/cwa-stack)（原 create-wl-app）的官方文档与升级日志：VitePress 静态站点，Markdown 是唯一内容源——每一篇升级日志都会自动进入列表、侧边栏、sitemap、RSS 与 `llms.txt` 中的一个节点。

## 📖 文档地图

| 板块 | 内容 |
| --- | --- |
| [快速开始](https://whyfail.github.io/cwa-docs/intro) | 环境准备、独立创建与全栈组合、非交互与管道输入 |
| [脚手架核心](https://whyfail.github.io/cwa-docs/core/%E8%84%9A%E6%89%8B%E6%9E%B6%E6%A0%B8%E5%BF%83) | 全栈组合、根级编排五命令、契约驱动、AI Agent 约定 |
| [模板文档](https://whyfail.github.io/cwa-docs/core/React%E6%A8%A1%E6%9D%BF) | React / Vue3 SPA、Next.js / Nuxt SSR、Spring Boot 后端逐一拆解 |
| [升级日志](https://whyfail.github.io/cwa-docs/archive) | 50 篇升级日志按时间倒序，从第一行代码到全栈引擎 |

## ⚡ 一分钟体验 cwa-stack

```bash
# 全栈组合：React/Vue/Next.js/Nuxt × Spring Boot，一条命令
npx cwa-stack create my-app --preset react-spring --package com.example.myapp

# 组合工程根级命令
pnpm run setup     # 环境门禁 · 随机密码 .env · 契约生成 Client
pnpm run dev       # MySQL/Redis + Spring Boot + 前端，一键就绪
pnpm run verify    # 双端全部门禁 + 真实登录 E2E
```

## 🛠️ 文档站开发

```bash
git clone https://github.com/whyfail/cwa-docs.git
cd cwa-docs
npm install
npm run dev          # 本地开发（127.0.0.1:5173）
npm run build        # 生产构建输出到 .vitepress/dist/
npm run preview      # 本地预览构建产物
npm run enrich       # 把标题/摘要/分类等物化回 log/、core/ frontmatter（幂等）
npm run check:seo    # 构建后 GEO 验收（title/canonical/OG/JSON-LD/sitemap/RSS/llms）
```

技术栈：VitePress 1.6（SSG + 本地中文分词搜索）；环境要求 Node.js 24 LTS（`>=24.11.0 <25`）。部署由 GitHub Actions 完成，构建后自动跑 `enrich --check` 与 `check:seo` 两道门禁。

## ✍️ 撰写升级日志

日志是文档站的灵魂。在 `log/` 下新增 `YYYY-MM-DD.md`，然后运行 `npm run enrich` 补全 `title` / `description` / `category` 等 frontmatter——时间线、侧边栏、sitemap、RSS、`llms.txt` 会**自动收录**，无需修改任何配置：

```md
# 2026-09-21

## 更新概览

- cwa-stack（v1.0.0）：npm 包由 create-wl-app 更名而来……
```

核心能力文档在 `core/` 下维护；站点外壳（时间线、导航、主题）在 `.vitepress/` 下维护，一般无需改动。

## 🔗 相关仓库

| 仓库 | 说明 |
| --- | --- |
| [whyfail/cwa-stack](https://github.com/whyfail/cwa-stack) | 脚手架本体（npm：cwa-stack） |
| [whyfail/vite_react_init](https://github.com/whyfail/vite_react_init) | React SPA 模板 |
| [whyfail/vite_vue3_init](https://github.com/whyfail/vite_vue3_init) | Vue 3 SPA 模板 |
| [whyfail/vite_react_ssr_init](https://github.com/whyfail/vite_react_ssr_init) | Next.js SSR 模板 |
| [whyfail/vite_vue3_ssr_init](https://github.com/whyfail/vite_vue3_ssr_init) | Nuxt SSR 模板 |
| [whyfail/springboot-template](https://github.com/whyfail/springboot-template) | Spring Boot 后端模板 |

---

<div align="center">

🎉 **契约驱动 | 开箱即验证 | AI 原生**

</div>
