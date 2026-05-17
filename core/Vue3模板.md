---
sidebar_position: 4
keywords: [create-wl-app, 开箱即用, 脚手架, vite, React, Vue3, 前端, 前端框架, 前端开发, 前端开发工具]
---

# 🚀 Vue3 模板 —— 现代化前端开发的最佳选择

[![小磊丶同学/vite_vue3_init](https://gitee.com/whyfail/vite_vue3_init/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b)](https://gitee.com/whyfail/vite_vue3_init)

## 🌟 核心优势

- ✅ **开箱即用** - 无需复杂配置，一键生成生产级Vue3项目
- ⚡ **极致性能** - 基于Vite 8 + Rolldown，构建速度飞起来
- 🎨 **现代化技术栈** - 集成Vue3生态最优质的依赖库
- 🔧 **开发友好** - 内置丰富的开发工具，提升开发效率
- 📱 **完美适配** - 自动适配各种屏幕尺寸

## 🛠️ 技术栈亮点

### 🔌 核心框架
- **Vue 3** - 最新稳定版，带来Composition API、Teleport、Suspense等强大特性
- **Vite 8** - 下一代前端构建工具，基于Rolldown引擎，速度飙升
- **TypeScript** - 默认使用 `.ts` 与 `<script setup lang="ts">`，增强类型约束和编辑器提示

### 🎯 状态管理
- **Pinia** - Vue3官方推荐状态管理库，API简洁，性能卓越
  - 原生支持Vue DevTools
  - 内置TypeScript支持
  - 模块化设计，易于扩展
  - 自带状态变更日志打印功能

### 🎨 UI组件库
- **Element Plus** - 企业级UI组件库，丰富的组件，优雅的设计
  - 基于Vue3开发，完美支持Composition API
  - 按需引入，减小打包体积
  - 支持主题定制

### 📱 页面适配
- **autofit.js** - 自动适配不同屏幕尺寸，无需手动配置
- **autoprefixer** - 自动添加CSS前缀，确保浏览器兼容性

### 🛠️ 开发工具
- **vite-plugin-vue-devtools** - 强大的Vue3开发调试工具
  - 替代传统vue-devtool，功能更强大
  - 支持代码跳转功能
  - 实时查看组件树和状态

```js
import { defineConfig } from "vite"
import VueDevTools from "vite-plugin-vue-devtools"

export default defineConfig({
  base: "./",
  plugins: [VueDevTools()],
})
```

- **unplugin-element-plus** - Element Plus 按需引入样式插件
  - 自动按需导入Element Plus组件样式
  - 减小打包体积
  - 提高开发效率

```js
import { defineConfig } from "vite"
import ElementPlus from "unplugin-element-plus/vite"

export default defineConfig({
  base: "./",
  plugins: [
    ElementPlus({
      useSource: true,
    }),
  ],
})
```

## 🚀 快速开始

```bash
# 创建项目
npx create-wl-app create

? 请选择模板 (Use arrow keys)
  vite-react
❯ vite-vue3

? 请输入项目名称 my-vue3-app

? 请输入项目描述 一个基于Vue3的现代化项目模板

✔ 项目生成中...

项目生成成功

# 进入项目目录
cd my-vue3-app

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build
```

## 📋 兼容性说明

- **浏览器支持** - 基于`@vitejs/plugin-legacy`配置，支持主流浏览器
- **CSS兼容性** - 自动添加浏览器前缀，确保跨浏览器一致性
- **响应式设计** - 完美适配移动端、平板和桌面端

## 💡 最佳实践

1. **组件设计** - 优先使用Composition API，组件代码更简洁
2. **状态管理** - 使用Pinia管理全局状态，遵循模块化设计
3. **样式开发** - 使用scoped样式，避免样式冲突
4. **代码规范** - 遵循ESLint规则，提交前自动检查
5. **类型检查** - 提交前执行 `pnpm run typecheck` 和 `pnpm run lint`
6. **性能优化** - 合理使用v-memo、v-once等指令优化渲染性能

## 📁 TypeScript 项目结构

```
src/
├── apis/              # API 接口管理
├── directive/         # 自定义指令
├── routes/            # 路由配置
├── stores/            # Pinia 状态管理
├── types/             # 全局类型补充
├── App.vue            # 根组件
├── main.ts            # 入口文件
├── shims-vue.d.ts     # Vue 模块声明
├── vite-env.d.ts      # Vite 环境声明
└── vue-router-meta.d.ts # 路由 meta 类型声明
```

## ✅ 类型检查

Vue3 模板已从 JS 迁移到 TypeScript，源码模块使用 `.ts`，Vue 单文件组件按需使用 `<script setup lang="ts">`。提交前建议执行：

```bash
pnpm run typecheck
pnpm run lint
```

## 📚 文档资源

- [项目地址](https://gitee.com/whyfail/vite_vue3_init)
- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [Vite 官方文档](https://vitejs.dev/)

## 🎯 Pinia 状态管理示例

### 创建状态存储

```ts
/**
 * stores状态模块化
 */
import { createPinia } from "pinia"
import useUserStore from "./storeUser"

// 创建全局状态
export const pinia = createPinia()

// 全局状态日志查看
pinia.use(({ store }) => {
  store.$subscribe((e) => {
    // 在存储变化的时候执行
    console.debug(
      `%c${new Date().toLocaleString()}：${e.storeId} 中的 ${e.events.key}状态改变：`,
      "background-color: #00BCD4; padding: 6px 12px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 600;"
    )
    console.debug(`   `, e)
  })
  store.$onAction((e) => {
    // 在 action 的时候执行
    console.debug(
      `%c${new Date().toLocaleString()}：${e.name} 方法调用：`,
      "background-color: #2196f3; padding: 6px 12px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 600;"
    )
    console.debug(`   `, e)
  })
})

export default function useStore() {
  return {
    storeUser: useUserStore(),
  }
}
```

### 定义状态模块

```ts
import { defineStore } from "pinia"

const useUserStore = defineStore({
  id: "storeUser",
  state: () => ({
    number: 0,
  }),

  actions: {
    addNumber() {
      this.number += 1
    },
    subtractNumber() {
      this.number -= 1
    },
  },
})

export default useUserStore
```

### 在组件中使用

```vue
<script setup lang="ts">
import useStore from "../stores"

const { storeUser } = useStore()
</script>

<template>
  <div>
    <div>{{ storeUser.number }}</div>
    <div>
      <button @click="storeUser.addNumber">+</button>
      <button @click="storeUser.subtractNumber">-</button>
    </div>
  </div>
</template>
```

---

🎉 **立即使用create-wl-app，开启你的现代化Vue3开发之旅！**

📱 适配大屏 | ⚡ 极致性能 | 🎨 优雅设计 | 🔧 开发友好
