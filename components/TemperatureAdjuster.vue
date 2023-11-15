<template>
  <div class="temperature-controls">
    <div class="temperature-controls__buttons">
      <div class="temperature-controls__adjustment-buttons">
        <UButton
          icon="i-tabler-plus"
          size="sm"
          variant="solid"
          class="increase-temp-button"
          @click.stop="updateSetTemp(1)"
        />
        <UButton
          icon="i-tabler-minus"
          size="sm"
          variant="outline"
          class="decrease-temp-button"
          @click.stop="updateSetTemp(-1)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  emits: ["error"],
  setup(_, ctx) {
    const controlStore = useControlStore();
    const systemStore = useSystemStore();

    const selectedZone = computed(() =>
      systemStore.getZoneById(systemStore.getSelectedSystem?.info.myZone),
    );
    const isTemperatureControlled = computed(
      () => systemStore.hasTemperatureSensors,
    );

    function updateSetTemp(direction: number) {
      if (!isTemperatureControlled?.value) {
        const newSystemTemp =
          systemStore.getSelectedSystem.info.setTemp + direction;
        controlStore
          .setSystemControl(
            systemStore.selectedAirconId,
            "setTemp",
            newSystemTemp,
          )
          .catch(() => {
            ctx.emit("error", true);
            setTimeout(() => ctx.emit("error", false), 600);
          });
      } else {
        controlStore
          .setZoneValue(
            systemStore.selectedAirconId,
            selectedZone.value?.number,
            direction,
          )
          .catch(() => {
            ctx.emit("error", true);
            setTimeout(() => ctx.emit("error", false), 600);
          });
      }
    }

    return {
      updateSetTemp,
      selectedZone,
      isTemperatureControlled,
    };
  },
});
</script>

<style lang="scss" scoped>
.temperature-controls {
  @apply relative z-10;
  -webkit-app-region: none;

  &__buttons {
    @apply flex flex-row gap-1 items-center flex-1;
  }

  &__adjustment-buttons {
    @apply flex flex-col gap-1.5;
  }

  .increase-temp-button {
    @apply text-primary-600 dark:text-black bg-white hover:bg-white/80 dark:bg-primary dark:hover:bg-primary-500;
  }

  .decrease-temp-button {
    @apply text-white dark:text-primary hover:bg-white/10;
  }
}
</style>
