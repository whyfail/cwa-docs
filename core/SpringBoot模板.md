---
sidebar_position: 8
keywords: [cwa-stack, spring-boot, Spring Boot, Java 25, 后端模板, 企业级, 后端开发, 后端框架, 微服务, 单体架构]
title: "Spring Boot 模板 —— 为 AI 而生的企业级后端模板"
description: "✅ AI 友好 - 内置 AGENTS.md 工程规则，架构边界、安全红线与验证命令写进项目本身 ✅ 模块化单体 - auth / user / authorization / audit / shared 业务域分层，域内保留 ..."
category: "SPRING ECOSYSTEM"
kicker: "JAVA BACKEND TEMPLATE"
accent: "#6db33f"
impact: "脚手架从纯前端扩展到前后端一体的企业级模板体系，Java 后端纳入同一套生成与质量门禁。"
readingTime: 5
visual: "scaling"
---
# 🚀 Spring Boot 模板 —— 为 AI 而生的企业级后端模板

[![GitHub Repo stars](https://img.shields.io/github/stars/whyfail/springboot-template?style=social)](https://github.com/whyfail/springboot-template)
[![CI](https://github.com/whyfail/springboot-template/actions/workflows/ci.yml/badge.svg)](https://github.com/whyfail/springboot-template/actions/workflows/ci.yml)

## 🌟 核心优势

- ✅ **AI 友好** - 内置 `AGENTS.md` 工程规则，架构边界、安全红线与验证命令写进项目本身
- ✅ **模块化单体** - `auth` / `user` / `authorization` / `audit` / `shared` 业务域分层，域内保留 api / application / domain / infrastructure 边界，ArchUnit 强制依赖方向
- 🔐 **可撤销会话** - opaque token + Redis 只存 SHA-256 摘要，登出、禁用、角色变更即时撤销；SPA 走 Bearer、SSR 走 HttpOnly Cookie，共享同一套鉴权模型
- 🛡️ **安全姿态** - 登录限流（IP/账号双维度 Lua 原子计数）、安全审计（IP/UA 只存哈希）、登录失败统一话术、Redis 故障鉴权失败关闭
- 🔧 **运维就绪** - 独立管理端口探针、结构化 JSON 日志、Prometheus 指标、OTLP tracing 开关、非 root 只读根文件系统镜像

## 🛠️ 技术栈亮点

### 🔌 核心框架

- **Java 25 LTS + Spring Boot 4.1.1** - Spring Framework 7 / Spring Security 7.1 / Hibernate 7，Maven Enforcer 强制版本区间
- **Spring Data JPA + Flyway** - MySQL 8.4，表结构只通过迁移演进，JPA `ddl-auto=validate`
- **Spring Data Redis** - 会话、限流计数与安全状态存储，Lua 脚本保证原子性

### 🔐 认证与权限

- **opaque token 会话** - 256-bit SecureRandom，普通会话 8 小时、remember 会话 30 天，同账号最多 5 个会话（Lua 原子驱逐最旧）
- **方法级权限** - `user:read` / `user:write` / `user:role:write` 权限点由迁移播种，首管理员通过显式 bootstrap 入口创建（无默认密码）
- **统一错误契约** - Problem Details 顶层携带 `code` / `msg` / `requestId`，与前端错误提示直接对接

### 🧭 默认模块

- **auth** - 登录、Bearer 过滤器、当前用户与注销、Security 配置
- **user** - 用户 CRUD、分页查询、启停与角色分配、首管理员 bootstrap
- **authorization** - 角色、权限与关联实体，权限点查询服务
- **audit** - 登录、注销与全部管理操作的安全审计，与业务写入同事务
- **shared** - 请求 ID、统一错误、分页契约、会话存储、限流器等跨域能力

## 📦 生成项目

仓库为模板源码，Java 包名与项目名使用 `{{ package }}` / `{{ name }}` 占位符。两种生成方式：

**cwa-stack（推荐）**：

```bash
printf '%s\n' 'spring-boot' 'my-backend' 'com.mycompany.mybackend' '项目描述' | npx cwa-stack create
```

**仓库自带脚本**：

```bash
./scripts/generate.sh -n my-backend -p com.mycompany.mybackend -d ../my-backend
```

生成后即为可运行的完整工程：`cp .env.example .env` 填入密码，`./mvnw clean verify` 跑全量门禁，`docker compose up -d --build` 一键启动 MySQL + Redis + 应用。

## 🧪 测试与质量门禁

| 门禁 | 基线 |
| --- | --- |
| 单元/切片测试 | 98 个（JUnit、Mockito、`@WebMvcTest`、`@DataJpaTest`） |
| 集成与契约测试 | 44 个（Testcontainers 真实 MySQL + Redis、OpenAPI 契约一致性） |
| JaCoCo | 全局行 ≥80% / 分支 ≥70%，核心域行 ≥90%、认证应用服务分支 ≥85% |
| 架构门禁 | ArchUnit 13 条规则：分层边界、依赖方向、循环依赖、禁字段注入 |
| CI | 生成冒烟测试 → 全量 verify → OCI 镜像 + SBOM |

更多细节见仓库 [README](https://github.com/whyfail/springboot-template#readme)，模板演进记录见 [2026-09-18 升级日志](../log/2026-09-18.md)。

## 🔗 前端组合与 CORS 白名单

- 与四套前端模板共享同一套登录契约（见 `docs/frontend-integration.md`）；API 根路径 `/api/v1`，登录响应顶层 `token/tokenType/expiresAt/user`，错误为 Problem Details 顶层 `code/msg/requestId`。
- CORS 白名单由 `APP_ALLOWED_ORIGINS` 控制（默认 `http://localhost:5173,http://localhost:3000`）；全栈组合工程由根级编排脚本按 Web 端口与 E2E preview 端口显式注入，无需手工维护。
- 组合模式说明：`cwa-stack` 的四个全栈预设（`react-spring` / `vue-spring` / `next-spring` / `nuxt-spring`）将本模板装配到 `apps/api`，与前端 `apps/web` 组成单一 Git 仓库工程，根级 `pnpm run verify` 会以本模板的 openapi.yaml 为契约做漂移检查与真实登录 E2E。
