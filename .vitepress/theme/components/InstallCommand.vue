<script setup lang="ts">
import { computed, ref } from "vue";

const tabs = [
  { name: "npm", cmd: "npx cwa-stack create" },
  { name: "pnpm", cmd: "pnpm dlx cwa-stack create" },
  { name: "yarn", cmd: "yarn dlx cwa-stack create" },
  { name: "bun", cmd: "bunx cwa-stack create" },
];

const active = ref(0);
const status = ref<"idle" | "ok" | "fail">("idle");
const current = computed(() => tabs[active.value].cmd);

let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(current.value);
    status.value = "ok";
  } catch {
    status.value = "fail";
  }
  clearTimeout(timer);
  timer = setTimeout(() => (status.value = "idle"), 1800);
}
</script>

<template>
  <div class="install-cmd">
    <div class="install-cmd__tabs" role="tablist" aria-label="包管理器">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.name"
        type="button"
        role="tab"
        class="install-cmd__tab"
        :class="{ 'is-active': index === active }"
        :aria-selected="index === active"
        @click="
          active = index;
          status = 'idle';
        "
      >
        {{ tab.name }}
      </button>
    </div>
    <div class="install-cmd__line">
      <code><span class="install-cmd__prompt" aria-hidden="true">$</span>{{ current }}</code>
      <button
        type="button"
        class="install-cmd__copy"
        :class="{ 'is-ok': status === 'ok', 'is-fail': status === 'fail' }"
        @click="copy"
      >
        {{ status === "ok" ? "已复制" : status === "fail" ? "复制失败" : "复制" }}
      </button>
    </div>
  </div>
</template>
