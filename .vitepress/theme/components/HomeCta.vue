<script setup lang="ts">
import { withBase } from "vitepress";
</script>

<template>
  <div class="home-cta">
    <p class="home-cta__title">准备好开始了吗？</p>
    <p class="home-cta__sub">一条命令创建生产级全栈项目，开箱即用，极速响应。</p>
    <p class="home-cta__actions">
      <a :href="withBase('/intro')">1 分钟快速开始</a>
      <a href="https://github.com/whyfail/cwa-stack">GitHub 仓库</a>
      <a :href="withBase('/archive')">浏览升级日志</a>
    </p>
  </div>
</template>
