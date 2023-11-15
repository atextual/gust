<template>
  <div class="app-container">
    <div class="drag-region" data-tauri-drag-region />
    <div class="status-bar" />
    <div class="status-container" data-tauri-drag-region v-if="systemMessage">
      <span v-if="systemMessage !== 'scanning'" class="status-text">
        {{ systemMessage }}
      </span>
      <div class="scanning-container" v-else>
        <client-only>
          <Vue3Lottie
            class="lottie-animation"
            :animation-data="loadingAnimation"
          />
        </client-only>
        <span class="status-text">Scanning network</span>
      </div>
    </div>
    <div v-else-if="systemState" class="content-container">
      <div class="controls-container">
        <ControlPanel />
        <ZoneList />
      </div>
    </div>
    <UAlert
      icon="i-ph-lightbulb-fill"
      :actions="alertActions"
      title="Check out a different view"
      class="alert-container"
      :ui="alertUI"
    />
  </div>
</template>

<script setup lang="ts">
import { appWindow, LogicalSize } from "@tauri-apps/api/window";
import loadingAnimation from "@/assets/lottie/loading.json";
import { Vue3Lottie } from "vue3-lottie";

const systemStore = useSystemStore();
const networkStore = useNetworkStore();
const systemState = computed(() => systemStore.getState || null);
const systemMessage = computed(() => systemStore.systemMessage);

const alertActions = computed(() => [
  {
    variant: "solid",
    label: "Compact",
    color:
      !systemState.value || systemState.value === "off" ? "black" : "primary",
    class: "action-text",
    click: () => resizeWindow(420, 768),
  },
  {
    variant: "outline",
    label: "Large",
    color:
      !systemState.value || systemState.value === "off" ? "black" : "primary",
    class: "action-text",
    click: () => resizeWindow(1024, 768),
  },
]);
const alertUI = {
  title: "alert-title text-xs tracking-wide",
  icon: {
    base: "alert-icon text-amber-400",
  },
};

onMounted(() => {
  systemStore.systemMessage = "scanning";
  networkStore.startPolling();
});

onUnmounted(() => {
  networkStore.stopPolling();
});

const resizeWindow = async (width: number, height: number) => {
  await appWindow.setSize(new LogicalSize(width, height));
};
</script>

<style scoped>
.app-container {
  @apply relative select-none bg-primary-200/20 dark:bg-primary-300/[.05] gap-4 p-4 pt-0 min-h-screen items-start md:items-center justify-start md:justify-center touch-pan-y flex flex-col;
}

.drag-region {
  @apply h-full w-full inset-0 fixed -z-0;
}

.status-bar {
  @apply h-4 w-full;
}

.status-container {
  @apply z-10 flex justify-center items-center flex-1 w-full;
}

.status-text {
  @apply text-sm font-light dark:text-gray-300 text-gray-800 tracking-wide cursor-default;
}

.scanning-container {
  @apply flex flex-col gap-2 items-center;
}

.lottie-animation {
  @apply w-12 h-12;
}

.content-container {
  @apply flex flex-1 h-full w-full touch-pan-y gap-4 flex-col md:items-center md:justify-center;
}

.controls-container {
  @apply inline-flex flex-none flex-col gap-6;
}

.action-text {
  @apply font-mono text-[10px];
}

.alert-container {
  @apply sticky inset-4 cursor-default z-20;
}

.alert-title {
  @apply text-[11px] font-mono;
}

.alert-icon {
  @apply w-4 h-4 flex-shrink-0;
}
</style>

<style>
html,
body,
#__nuxt {
  @apply bg-gray-300/50 dark:bg-gray-900 select-none;
}
</style>
