<template>
  <div class="system-status">
    <div class="system-status__background"></div>
    <div class="system-status__content">
      <div class="system-status__temperature">
        <h1
          v-if="systemState === 'on'"
          class="system-status__temperature-value"
        >
          <span>{{ selectedZone?.setTemp ?? systemInfo?.setTemp }}</span>
        </h1>
        <span v-else class="system-status__system-off">SYSTEM&nbsp;OFF</span>
        <span
          v-if="systemState === 'on'"
          class="system-status__temperature-unit"
          >°</span
        >
      </div>
      <div class="system-status__zone-controls">
        <UButton
          v-if="systemInfo?.myZone !== 0"
          icon="i-tabler-chevron-left"
          size="xs"
          class="system-status__zone-button"
          @click.stop="updateZone(-1)"
        />
        <span class="system-status__zone-name">
          {{ selectedZone?.name || "AUTO" }}
        </span>
        <UButton
          v-if="systemInfo?.myZone !== 0"
          icon="i-tabler-chevron-right"
          size="xs"
          class="system-status__zone-button"
          @click.stop="updateZone(1)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { ZonePayload } from "@/types";

export default defineComponent({
  setup() {
    const systemStore = useSystemStore();
    const controlStore = useControlStore();

    const systemState = computed(() => systemStore?.getState);
    const systemInfo = computed(() => systemStore?.getSelectedSystem?.info);
    const selectedZone = computed(() => systemStore?.getZoneById("myZone"));
    const systemZones = computed(() => systemStore?.getZones);

    const openZones = computed(() =>
      Object.values(systemZones.value ?? {})
        .filter((zone: ZonePayload) => zone?.state === "open")
        .map((zone: ZonePayload) => zone?.number),
    );

    function updateZone(direction: number) {
      const currentIndex = openZones.value.indexOf(selectedZone.value.number);
      let nextIndex = currentIndex + direction;

      if (nextIndex >= openZones.value.length) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = openZones.value.length - 1;
      }

      const nextZone = openZones.value[nextIndex];

      if (nextZone) {
        controlStore.setSystemControl(
          systemStore.selectedAirconId,
          "myZone",
          nextZone,
        );
      }
    }

    return {
      systemInfo,
      systemState,
      updateZone,
      selectedZone,
    };
  },
});
</script>

<style lang="scss" scoped>
.system-status {
  @apply relative;
  -webkit-app-region: none;

  &__background {
    @apply absolute inset-0 bg-primary/40 blur-2xl z-10;
  }

  &__content {
    @apply relative flex flex-col gap-1 items-center flex-1;
  }

  &__temperature {
    @apply flex flex-row;
  }

  &__temperature-value {
    @apply text-[42px] text-gray-100 dark:text-white leading-none text-center z-20;
  }

  &__system-off {
    @apply font-mono text-base font-semibold text-white dark:text-inherit;
  }

  &__temperature-unit {
    @apply text-3xl text-white dark:text-white font-light leading-none -mt-1 -mr-2.5;
  }

  &__zone-controls {
    @apply flex flex-row gap-0.5 z-20;
  }

  &__zone-button {
    @apply text-[10px] flex justify-center backdrop-blur-lg items-center w-5 h-5 shadow-sm text-center text-white font-semibold dark:text-white/80 uppercase font-mono p-0 bg-black/20 hover:bg-black/30 dark:bg-primary-500/30 dark:hover:bg-primary-500/40 rounded-md;
  }

  &__zone-name {
    @apply text-[10px] min-w-[84px] flex justify-center items-center text-white font-semibold dark:text-white/80 uppercase font-mono py-0.5 px-4 bg-black/20 dark:bg-primary-500/30 rounded-md;
  }
}
</style>
