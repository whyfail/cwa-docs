<script setup lang="ts">
import { withBase } from "vitepress";
import { data as allLogs } from "../../data/logs.data";
</script>

<template>
  <section class="update-bar" aria-label="最新更新日志">
    <div class="update-bar__head">
      <span class="update-bar__badge">UPDATE</span>
      <span class="update-bar__label">更新日志</span>
      <a class="update-bar__more" :href="withBase('/archive')">查看全部 {{ allLogs.length }} 篇 →</a>
    </div>
    <ol class="update-bar__list">
      <li v-for="item in allLogs.slice(0, 3)" :key="item.url">
        <a :href="withBase(item.url)">
          <time class="update-bar__date" :datetime="item.date">{{ item.date }}</time>
          <span class="update-bar__title">{{ item.title }}</span>
        </a>
      </li>
    </ol>
  </section>
</template>
