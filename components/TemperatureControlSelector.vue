<template>
  <div class="temp-control">
    <div
      v-for="control in tempControls"
      :key="control"
      class="temp-control__button-container"
    >
      <UButton
        size="xs"
        :variant="selectedTempControl === control ? 'selected' : 'unselected'"
        :label="control"
        :class="{
          'temp-control__button--selected': selectedTempControl === control,
          'temp-control__button--unselected': selectedTempControl !== control,
        }"
        @click.stop="updateTempControl(control)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { TempControls } from "@/types";

export default defineComponent({
  setup() {
    const controlStore = useControlStore();
    const systemStore = useSystemStore();

    const tempControls = Object.keys(
      TempControls,
    ) as (keyof typeof TempControls)[];
    const selectedTempControl = computed(() => systemStore.getMode || "myZone");

    function updateTempControl(value: keyof typeof TempControls) {
      controlStore.setSystemControl(
        systemStore.selectedAirconId,
        "tempControl",
        value,
      );
    }

    return {
      tempControls,
      selectedTempControl,
      updateTempControl,
    };
  },
});
</script>

<style lang="scss" scoped>
.temp-control {
  @apply flex flex-row p-2 md:pb-1 gap-4 md:gap-3 justify-center items-center;

  &__button-container {
    @apply flex-1 w-full flex justify-center items-center;
  }

  &__button--selected {
    @apply font-semibold capitalize justify-center flex-1 md:flex-none p-2 px-4 ring-primary/70 text-[10px] md:text-[11px] font-mono;
  }

  &__button--unselected {
    @apply font-light capitalize justify-center flex-1 md:flex-none p-2 px-4 text-[10px] md:text-[11px] font-mono;
  }
}
</style>
