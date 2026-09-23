<script setup lang="ts">
import { data as allLogs } from "../../data/logs.data";

const stats = [
  { value: `${allLogs.length}`, label: "篇演进日志" },
  { value: "5", label: "套生产模板" },
  { value: "4", label: "个全栈预设" },
  { value: "10x+", label: "构建提速" },
];
</script>

<template>
  <div class="home-stats" aria-label="cwa-stack 关键数据">
    <div v-for="item in stats" :key="item.label" class="home-stats__item">
      <span class="home-stats__value">{{ item.value }}</span>
      <span class="home-stats__label">{{ item.label }}</span>
    </div>
  </div>
</template>
