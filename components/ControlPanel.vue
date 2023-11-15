<template>
  <div class="control-outer">
    <div class="control-shadow" />
    <div class="control-window">
      <div class="control-window__inner">
        <div class="control-window__animation">
          <client-only>
            <Vue3Lottie
              v-if="lottieAnimation"
              :animation-data="lottieAnimation"
              width="100%"
              :class="{ grayscale: systemState === 'off' }"
            />
          </client-only>
        </div>
        <ToggleUnit />
        <TemperatureReading :class="{ 'animate-shake': tempError }" />
        <TemperatureAdjuster @error="handleTempError" />
      </div>
      <div class="control-panel">
        <ModeSelector class="control-panel__mode" />
        <FanSpeedSelector class="control-panel__fan" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue3Lottie } from "vue3-lottie";
import snowJSON from "@/assets/lottie/snow.json";
import fireJSON from "@/assets/lottie/fire.json";
import sunJSON from "@/assets/lottie/sun.json";
import windJSON from "@/assets/lottie/wind.json";
import offlineJSON from "@/assets/lottie/offline.json";

export default defineComponent({
  components: {
    Vue3Lottie,
  },
  setup() {
    const controlStore = useControlStore();
    const systemStore = useSystemStore();

    const systemState = computed(() => systemStore.getState);
    const systemMode = computed(() => systemStore.getMode);
    const tempError = ref(false);

    const lottieAnimation = computed(() => {
      switch (systemState.value) {
        case "on":
          switch (systemMode.value) {
            case "cool":
              return snowJSON;
            case "heat":
              return fireJSON;
            case "vent":
              return windJSON;
            case "dry":
              return sunJSON;
            default:
              return null;
          }
        default:
          return offlineJSON;
      }
    });

    const handleTempError = (error: boolean) => {
      tempError.value = error;
    };

    return {
      systemState,
      lottieAnimation,
      tempError,
      handleTempError,
    };
  },
});
</script>

<style lang="scss">
.control {
  &-outer {
    @apply inline-flex relative flex-col md:flex-row gap-2 md:gap-6 justify-center z-10;
  }
  &-shadow {
    @apply md:hidden dark:shadow-lg dark:shadow-primary-800/20 z-0 absolute inset-2 rounded-xl;
  }
  &-window {
    @apply bg-white dark:bg-primary/30 z-20 border border-black/[0.25] dark:border-primary-400/30 rounded-xl overflow-hidden flex flex-col md:flex-row;
    &__inner {
      @apply relative md:w-full md:w-96 flex-shrink bg-primary-600 cursor-default dark:bg-black/30 gap-6 px-3 md:px-4 md:gap-12 py-3 flex items-center justify-between;
    }
    &__animation {
      @apply w-full h-full absolute flex justify-center items-center inset-0 z-0 opacity-60 blur-[2px] opacity-60;
    }
  }
  &-panel {
    @apply flex flex-col h-full justify-around bg-primary-100 dark:bg-primary/40 md:px-1;
    -webkit-app-region: none;
    &__mode {
      @apply flex-1 md:flex-none bg-white/30 dark:bg-transparent;
    }
    &__fan {
      @apply flex-1 md:flex-none bg-primary-200/20 dark:bg-zinc-900/80 dark:md:bg-transparent md:bg-inherit;
    }
  }
}
</style>
