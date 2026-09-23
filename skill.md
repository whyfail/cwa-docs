---
title: Skill
---

# AI Agent 技能

cwa-stack 随包发布 Agent 技能（遵循 Agent Skills 规范：`SKILL.md` + `scripts/`），支持技能的 AI Agent（Claude Code / Codex / ZCode 等）可以一句话完成项目创建与初始化，配合[快速开始](/intro)中推荐的 AI 工具使用效果最佳。npm 包 `cwa-stack` 内同样携带该技能（`skills/create-app/`）。

## 🤖 create-app：一句话创建项目

`create-app` 是 cwa-stack 的官方 Agent 技能，覆盖 cwa-stack 支持的全部项目形态：

| 项目类型 | 组成 |
| --- | --- |
| 独立前端 | React / Vue 3（SPA），Next.js / Nuxt（SSR） |
| 独立后端 | Spring Boot 单体（Java 25，需指定 Java 包名） |
| 全栈组合 | 前端 + Spring Boot 一次生成：`react-spring`、`vue-spring`、`next-spring`、`nuxt-spring` |

技能会自动完成：环境检查（Node、pnpm、Git，后端模板额外确认 Java 25 与 Docker）→ 拒绝覆盖已存在的目录 → 通过 npm 获取 `cwa-stack@latest` 生成项目 → 安装依赖并执行质量门禁（前端运行 `typecheck` / `lint` / `build`，后端运行 `./mvnw clean verify`）→ 前端模板随后启动开发服务并报告访问地址。

全栈组合工程还会执行 `pnpm run setup`：生成随机密码 `.env`，依据 `apps/api/openapi.yaml` 自动生成前端 API Client（禁止手工编辑）；`pnpm run verify` 提供契约漂移检查 + 双端质量门禁 + 真实登录 E2E 验证。

## 📦 安装

**方式一：skills CLI 一键安装（推荐）**

```bash
npx skills add whyfail/cwa-stack -g
```

`-g` 表示安装为全局（用户级）技能；CLI 会自动发现仓库中的 `create-app` 技能，并识别本机已安装的 Agent（Codex / ZCode / Claude Code 等）供你选择。加 `-y` 可跳过确认一步完成。

**方式二：手动安装（Codex / ZCode）**

```bash
# 下载技能
git clone --depth 1 https://github.com/whyfail/cwa-stack.git /tmp/cwa-stack

# Codex：拷贝到 ~/.codex/skills/
mkdir -p ~/.codex/skills
cp -R /tmp/cwa-stack/skills/create-app ~/.codex/skills/

# ZCode：拷贝到 ~/.agents/skills/
mkdir -p ~/.agents/skills
cp -R /tmp/cwa-stack/skills/create-app ~/.agents/skills/
```

**方式三：Claude Code 插件市场**

Claude Code 用户也可以通过插件市场安装：

```bash
/plugin marketplace add whyfail/cwa-stack
/plugin install create-app@cwa-stack
```

## 💬 使用

安装后对 Agent 说：

```text
用 cwa-stack 创建一个全栈项目
```

Codex 中也可以通过 `$create-app` 直接触发技能；只说「新建一个项目」时，Agent 会先确认项目名称与技术栈方向（前端 / 后端 / 全栈组合），再开始创建。

> 技能源码：[github.com/whyfail/cwa-stack → skills/create-app](https://github.com/whyfail/cwa-stack/tree/main/skills/create-app)
