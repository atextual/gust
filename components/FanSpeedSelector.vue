<template>
  <div class="fan-speed">
    <div
      v-for="speed in fanSpeeds"
      :key="speed"
      class="fan-speed__button-container"
    >
      <UButton
        size="xs"
        :variant="selectedFanSpeed === speed ? 'selected' : 'unselected'"
        :label="speed"
        :class="{
          'fan-speed__button--selected': selectedFanSpeed === speed,
          'fan-speed__button--unselected': selectedFanSpeed !== speed,
        }"
        @click.stop="updateFanSpeed(speed)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useControlStore } from "@/stores/control";
import { FanSpeeds } from "@/types";

export default defineComponent({
  setup() {
    const controlStore = useControlStore();
    const systemStore = useSystemStore();

    const fanSpeeds = Object.keys(FanSpeeds) as (keyof typeof FanSpeeds)[];
    const selectedFanSpeed = computed(() => systemStore.getFanSpeed);

    function updateFanSpeed(value: keyof typeof FanSpeeds) {
      controlStore.setSystemControl(systemStore.selectedAirconId, "fan", value);
    }

    return {
      fanSpeeds,
      selectedFanSpeed,
      updateFanSpeed,
    };
  },
});
</script>

<style lang="scss" scoped>
.fan-speed {
  @apply flex flex-row md:pt-1 p-2 gap-4 md:gap-3 justify-center items-center;

  &__button-container {
    @apply flex-1 w-full flex justify-center items-center;
  }

  &__button--selected {
    @apply font-semibold capitalize flex-1 md:flex-none justify-center py-2 px-3 ring-primary/70 text-[10px] md:text-[11px] font-mono;
  }

  &__button--unselected {
    @apply font-light capitalize flex-1 md:flex-none justify-center py-2 px-3 text-[10px] md:text-[11px] font-mono;
  }
}
</style>
