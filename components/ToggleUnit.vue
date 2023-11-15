<template>
  <div class="system-toggle">
    <UButtonGroup orientation="vertical" size="md">
      <UButton
        v-for="state in states"
        :key="state"
        :label="state"
        :color="systemState === state ? 'primary' : 'white'"
        :variant="systemState === state ? 'solid' : 'outline'"
        class="system-toggle__button"
        :class="
          systemState === state
            ? 'system-toggle__button--on'
            : 'system-toggle__button--off'
        "
        @click.stop="updateState"
      />
    </UButtonGroup>
  </div>
</template>

<script>
export default defineComponent({
  setup() {
    const controlStore = useControlStore();
    const systemStore = useSystemStore();

    const states = ["on", "off"];
    const systemState = computed(() => systemStore.getState);
    const systemMode = computed(() => systemStore.getMode);
    const appConfig = useAppConfig();

    onBeforeMount(() => {
      watchEffect(() => {
        if (systemState.value === "off") {
          appConfig.ui.primary = "zinc";
        } else if (systemMode.value === "cool") {
          appConfig.ui.primary = "blue";
        } else if (systemMode.value === "heat") {
          appConfig.ui.primary = "orange";
        } else if (systemMode.value === "vent") {
          appConfig.ui.primary = "green";
        } else if (systemMode.value === "dry") {
          appConfig.ui.primary = "indigo";
        } else {
          appConfig.ui.primary = "gray";
        }
      });
    });

    function updateState() {
      const newState = systemState.value === "on" ? "off" : "on";
      controlStore.setSystemControl(
        systemStore.selectedAirconId,
        "state",
        newState,
      );
    }

    return {
      states,
      systemState,
      updateState,
    };
  },
});
</script>
<style lang="scss" scoped>
.system-toggle {
  @apply z-10;
  -webkit-app-region: none;
  &__button {
    @apply capitalize flex-1 px-2 text-xs;
    &--on {
      @apply text-primary-600 bg-white dark:text-black dark:bg-primary;
    }
    &--off {
      @apply text-white bg-primary-400/40 hover:bg-primary-100/30 dark:text-primary dark:bg-transparent dark:hover:bg-white/10;
    }
  }
}
</style>
