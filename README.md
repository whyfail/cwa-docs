# 简介

- 不到一分钟即可创建好的一个基本前端项目模板
- 文档站采用 React、Canvas 2D 与 CSS 3D 构建交互式演进时间线，Markdown 日志仍是唯一内容源

## 文档站开发

```bash
npm install
npm run dev
```

生产构建输出到 `dist`：

```bash
npm run build
npm run preview
```

## 环境准备

1. 首先，请确保你的设备上已经安装了 [Git](https://git-scm.com/)。
2. 接着，需要安装 [Node.js](https://nodejs.org)。SPA 模板要求 `^20.19.0 || >=22.12.0`，SSR 模板要求 `^22.12.0 || ^24.11.0 || >=26.0.0`。
3. 安装完这两个环境后，你就可以开始创建项目了。

## 开始

1. 打开你想要创建项目的文件夹，并在此处打开终端。
2. 在终端中输入 `npx create-wl-app create`，依次选择技术栈、应用类型和模板，再输入项目名称与项目描述。
3. 下载选择的模板，通常只需要几秒钟就能完成，这里只下载模板，并没有下载依赖。
4. 在终端中输入 `cd <项目名称>`，进入到项目文件夹中。
5. 初始化一个 Git 仓库，使用 `git init` 命令，并添加和提交文件。
6. 下载项目所需的依赖，使用 `pnpm install` 命令。
7. 最后，输入 `code .` 命令，将会调用 Visual Studio Code 来打开这个项目。

当前支持 `vite-react`、`vite-vue3`、`next-react-ssr`、`nuxt-vue3-ssr` 四个模板。自动化场景也可通过标准输入依次传入模板标识、项目名称和可选描述：

```bash
printf '%s\n' 'next-react-ssr' 'my-app' 'Next.js SSR 项目' | npx create-wl-app create
```
