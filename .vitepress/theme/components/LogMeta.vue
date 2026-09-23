<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

const { frontmatter } = useData();

const fm = computed(() => frontmatter.value);
const isLog = computed(() => Boolean(fm.value.date));
const keywords = computed(() =>
  Array.isArray(fm.value.keywords) ? fm.value.keywords.filter((k: string) => k !== fm.value.title && k !== fm.value.date).slice(0, 8) : [],
);
const visible = computed(() => Boolean(fm.value.category && (isLog.value || fm.value.readingTime)));
</script>

<template>
  <div v-if="visible" class="log-meta" :style="{ '--meta-accent': fm.accent || '#45e8ff' }">
    <div class="log-meta__row">
      <span v-if="fm.date" class="log-meta__date">{{ fm.date }}</span>
      <span class="log-meta__cat">{{ fm.category }}</span>
      <span v-if="fm.readingTime" class="log-meta__time">约 {{ fm.readingTime }} 分钟阅读</span>
    </div>
    <p v-if="fm.kicker" class="log-meta__kicker">{{ fm.kicker }}</p>
    <p v-if="fm.impact" class="log-meta__impact">{{ fm.impact }}</p>
    <ul v-if="keywords.length" class="log-meta__keywords" aria-label="关键词">
      <li v-for="keyword in keywords" :key="keyword">{{ keyword }}</li>
    </ul>
  </div>
</template>
