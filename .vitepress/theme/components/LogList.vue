<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { data as allLogs } from "../../data/logs.data";

// allLogs 按日期倒序，年份区间按全量计算（years[0] 最新，years[last] 最早）
const years = computed(() => [...new Set(allLogs.map((item) => item.date.slice(0, 4)))]);
</script>

<template>
  <section class="log-list" aria-label="全部升级日志">
    <p class="log-list__kicker">UPGRADE LOG</p>
    <h2 class="log-list__title">全部升级日志</h2>
    <p class="log-list__sub">
      {{ allLogs.length }} 篇升级日志 · {{ years[years.length - 1] }} — {{ years[0] }} ·
      按时间倒序，每一次模板升级都有据可查
    </p>

    <ol class="log-list__items">
      <li
        v-for="item in allLogs"
        :key="item.url"
        class="log-list__item"
        :style="{ '--era-accent': item.accent }"
      >
        <a class="log-list__link" :href="withBase(item.url)">
          <time class="log-list__date" :datetime="item.date">{{ item.date }}</time>
          <span class="log-list__body">
            <span class="log-list__headline">{{ item.title }}</span>
            <span class="log-list__meta">
              {{ item.category }} · 约 {{ item.readingTime }} 分钟
            </span>
          </span>
          <span class="log-list__arrow" aria-hidden="true">→</span>
        </a>
      </li>
    </ol>
  </section>
</template>
