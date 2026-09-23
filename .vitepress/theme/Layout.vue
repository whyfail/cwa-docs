<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData, withBase } from "vitepress";
import { onMounted } from "vue";
import LogMeta from "./components/LogMeta.vue";
import InstallCommand from "./components/InstallCommand.vue";
import UpdateBar from "./components/UpdateBar.vue";

const { frontmatter } = useData();

// 旧 SPA hash 链接兼容（一年后可移除）：
// https://site/#/docs/log/2026-09-21 → /log/2026-09-21
onMounted(() => {
  const match = window.location.hash.match(/^#\/?(?:docs\/)?(.+)$/);
  if (!match) return;
  let id = decodeURIComponent(match[1]).split(/[?#]/)[0].replace(/\.md$/, "");
  if (id === "intro" || id === "guide/quick-start") id = "intro";
  else if (id === "" || id === "index" || id === "guide/overview") return;
  else if (!/^(log|core)\//.test(id)) return;
  window.location.replace(`${window.location.origin}${withBase(`/${id}`)}`);
});
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <LogMeta v-if="frontmatter.category" />
    </template>
    <template #home-hero-after>
      <InstallCommand />
      <UpdateBar />
    </template>
  </DefaultTheme.Layout>
</template>
