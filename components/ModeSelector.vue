<template>
  <div class="mode-selector">
    <div
      v-for="mode in modes"
      :key="mode"
      class="mode-selector__button-container"
    >
      <UButton
        size="xs"
        :variant="selectedMode === mode ? 'selected' : 'unselected'"
        :label="mode === 'vent' ? 'fan' : mode"
        :icon="getIcon(mode)"
        :class="{
          'mode-selector__button--selected': selectedMode === mode,
          'mode-selector__button--unselected': selectedMode !== mode,
        }"
        @click.stop="updateMode(mode)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AirconModes } from "@/types";

export default defineComponent({
  setup() {
    const controlStore = useControlStore();
    const systemStore = useSystemStore();

    const modes = Object.keys(AirconModes) as (keyof typeof AirconModes)[];
    const selectedMode = computed(() => systemStore.getMode);

    function updateMode(value: keyof typeof AirconModes) {
      controlStore.setSystemControl(
        systemStore.selectedAirconId,
        "mode",
        value,
      );
    }

    function getIcon(mode: keyof typeof AirconModes): string {
      const icons: { [key: string]: string } = {
        cool: "i-ph-snowflake-duotone",
        heat: "i-ph-flame-duotone",
        vent: "i-ph-fan-duotone",
        dry: "i-ph-sun-duotone",
      };
      return icons[mode as string] || "i-mdi-fan";
    }

    return {
      modes,
      getIcon,
      selectedMode,
      updateMode,
    };
  },
});
</script>

<style lang="scss" scoped>
.mode-selector {
  @apply flex flex-row p-2 md:pb-1 gap-4 md:gap-3 justify-center items-center;

  &__button-container {
    @apply flex-1 w-full flex justify-center items-center;
  }

  &__button--selected {
    @apply font-semibold capitalize justify-center flex-1 md:flex-none p-2 px-4 text-[10px] md:text-[11px] font-mono;
  }

  &__button--unselected {
    @apply font-light capitalize justify-center flex-1 md:flex-none p-2 px-4 text-[10px] md:text-[11px] font-mono;
  }
}
</style>
