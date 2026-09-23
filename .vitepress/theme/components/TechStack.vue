<script setup lang="ts">
const stack = ["Vite", "React", "Vue", "Next.js", "Nuxt", "Spring Boot", "TypeScript", "Node.js"];
</script>

<template>
  <div class="home-stack" aria-label="技术栈">
    <p class="home-stack__kicker">TECH STACK</p>
    <ul class="home-stack__list">
      <li v-for="name in stack" :key="name">{{ name }}</li>
    </ul>
  </div>
</template>
