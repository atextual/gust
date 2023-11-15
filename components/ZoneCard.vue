<template>
  <UCard
    :ui="cardUi"
    :class="{ 'animate-shake': cardError }"
    @click.stop="updateMyZone"
    v-if="zone"
  >
    <template #header>
      <div class="card-header">
        <div class="card-header__text">
          <span class="text-name" :class="textNameClasses">{{
            zone?.name.toLowerCase()
          }}</span>
          <span
            v-if="zone?.measuredTemp"
            class="text-temp"
            :class="textTempClasses"
            >Currently: {{ zone?.measuredTemp }}°</span
          >
          <span v-else class="text-temp opacity-50" :class="textTempClasses"
            >No sensor</span
          >
        </div>
        <div class="state-toggle">
          <UButton
            icon="i-tabler-power"
            size="xs"
            :variant="zoneState === 'open' ? 'solid' : 'outline'"
            :color="zoneState === 'open' ? 'primary' : undefined"
            :ui="{ rounded: 'rounded-full' }"
            @click.stop="updateZoneState"
          />
        </div>
      </div>
    </template>
    <template #default>
      <div class="card-content">
        <UButton
          icon="i-tabler-minus"
          variant="outline"
          :class="decreaseTempButtonClasses"
          @click.stop="updateZoneValue(-1)"
        />
        <div class="card-content__middle">
          <div class="temperature" :class="temperatureClasses">
            <span class="temperature__value">{{ displayValue }}</span>
            <span
              v-if="isTemperatureControlled"
              class="temperature__unit temperature__unit--degree"
              >°</span
            >
            <span v-else class="temperature__unit"
              ><UIcon name="i-tabler-percentage"
            /></span>
          </div>
        </div>
        <UButton
          icon="i-tabler-plus"
          :variant="zoneState === 'open' ? 'solid' : 'outline'"
          :class="increaseTempButtonClasses"
          @click.stop="updateZoneValue(1)"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    zone: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const controlStore = useControlStore();
    const systemStore = useSystemStore();

    const selectedZone = computed(
      () => systemStore.getSelectedSystem?.info.myZone,
    );
    const zoneState = computed(() => props.zone?.state);
    const cardError = ref(false);

    const isTemperatureControlled = computed(() => {
      return systemStore.hasTemperatureSensors;
    });

    const displayValue = computed(() => {
      if (isTemperatureControlled.value) {
        return props.zone?.setTemp;
      } else {
        return props.zone?.value;
      }
    });

    const cardUi = computed(() => ({
      base: "animate flex flex-col cursor-pointer transition duration-100 bg-white",
      divide: "divide-y divide-white-200 dark:divide-white/5",
      background:
        "bg-white dark:bg-gray-900 dark:hover:bg-primary/5 hover:bg-primary/5",
      ring: getRingClass(),
      header: {
        background: getHeaderBackgroundClass(),
        padding: getHeaderPaddingClass(),
      },
      body: {
        background: getBodyBackgroundClass(),
        padding: "p-2.5 sm:p-2.5",
      },
      rounded: "rounded-[12px]",
    }));

    const textNameClasses = computed(() => ({
      "text-name--closed": zoneState.value !== "open",
      "text-name--open": zoneState.value === "open",
    }));

    const textTempClasses = computed(() => ({
      "text-temp--closed": zoneState.value !== "open",
      "text-temp--open": zoneState.value === "open",
    }));

    const decreaseTempButtonClasses = computed(() => ({
      "card-content__button-outline--on": zoneState.value === "open",
      "card-content__button-outline--off": zoneState.value === "close",
      "card-content__button-outline--disabled":
        props.zone?.setTemp === 16 || props.zone?.value === 0,
    }));

    const increaseTempButtonClasses = computed(() => ({
      "card-content__button--default":
        zoneState.value === "open" && props.zone?.number !== selectedZone.value,
      "card-content__button--off": zoneState.value === "close",
      "card-content__button--disabled":
        props.zone?.setTemp === 32 || props.zone?.value === 100,
    }));

    const temperatureClasses = computed(() => ({
      "temperature--off": zoneState.value !== "open",
    }));

    function getHeaderBackgroundClass() {
      if (selectedZone.value === props.zone?.number) {
        return "bg-primary-200/50 dark:bg-primary/20";
      } else if (zoneState.value === "close") {
        return "bg-gray-100/50 dark:bg-white/[0.02]";
      } else {
        return "bg-primary-100/40 dark:bg-white/[.08]";
      }
    }

    function getBodyBackgroundClass() {
      if (selectedZone.value === props.zone?.number) {
        return "bg-primary-200/50 dark:bg-primary/10";
      } else if (zoneState.value === "close") {
        return "bg-gray-100/50 dark:bg-white/[0.02]";
      } else {
        return "bg-white/60 dark:bg-white/[.08]";
      }
    }

    function getRingClass() {
      if (selectedZone.value === props.zone?.number) {
        return "ring-1 dark:ring-1 ring-primary dark:ring-primary";
      } else if (zoneState.value === "close") {
        return "ring-1 ring-gray-400/40 dark:ring-white/10";
      } else {
        return "ring-1 ring-gray-400/20 dark:ring-white/20";
      }
    }

    function getHeaderPaddingClass() {
      if (selectedZone.value === props.zone?.number) {
        return "p-2.5 sm:py-2 sm:px-2.5";
      } else {
        return "p-2.5 sm:py-2 sm:px-2.5";
      }
    }

    function updateMyZone() {
      if (zoneState.value === "open") {
        controlStore.setSystemControl(
          systemStore.selectedAirconId,
          "myZone",
          props.zone?.number,
        );
      }
    }

    function updateZoneState() {
      if (selectedZone.value !== props.zone?.number) {
        const newState = zoneState.value === "close" ? "open" : "close";
        controlStore.setZoneState(
          systemStore.selectedAirconId,
          props.zone?.number,
          newState,
        );
      }
    }

    function updateZoneValue(direction: number) {
      controlStore
        .setZoneValue(
          systemStore.selectedAirconId,
          props.zone?.number,
          direction,
        )
        .catch(() => {
          cardError.value = true;
          setTimeout(() => (cardError.value = false), 600);
        });
    }

    return {
      cardError,
      zoneState,
      selectedZone,
      updateMyZone,
      updateZoneState,
      updateZoneValue,
      isTemperatureControlled,
      displayValue,
      cardUi,
      textNameClasses,
      textTempClasses,
      decreaseTempButtonClasses,
      increaseTempButtonClasses,
      temperatureClasses,
    };
  },
});
</script>

<style scoped>
.card {
  &-header {
    @apply flex flex-row items-stretch gap-3;
    &__text {
      @apply flex flex-col flex-1 gap-0.5 justify-around;
      .text {
        &-name {
          @apply text-xs lg:text-sm font-semibold leading-none capitalize;
          &--closed {
            @apply text-gray-400 dark:text-white/30;
          }
          &--open {
            @apply text-gray-600 dark:text-white;
          }
        }
        &-temp {
          @apply text-[10px] leading-none;
          &--closed {
            @apply text-gray-300 dark:text-white/20;
          }
          &--open {
            @apply text-black/40 dark:text-white/60;
          }
        }
      }
      .state-toggle {
        @apply flex flex-col items-center justify-center;
      }
    }
  }
  &-content {
    @apply flex flex-row gap-2;
    &__button {
      @apply w-10 h-10 justify-center transition transition-colors duration-100;
      &-outline {
        @apply ring-2;
        &--on {
          @apply text-primary dark:text-primary;
        }
        &--off {
          @apply text-gray-400 dark:text-white/10;
        }
        &--disabled {
          @apply text-gray-200 dark:text-primary/20;
        }
      }
      &--default {
        @apply text-white bg-primary hover:bg-primary-600 dark:text-primary-900;
      }
      &--off {
        @apply text-gray-400 dark:text-white/10;
      }
      &--disabled {
        @apply bg-primary/10 hover:bg-primary/20 shadow-none text-white/80 dark:bg-primary/20 dark:text-black/20;
      }
    }
    &__middle {
      @apply flex flex-1 flex-row text-center items-center justify-center px-3;
      .temperature {
        @apply flex flex-row items-center;
        &--off {
          @apply text-black/30 dark:text-white/10;
        }
        &__value {
          @apply text-xl md:text-2xl leading-none capitalize;
        }
        &__unit {
          @apply text-xl leading-none flex flex-col items-center justify-center;
          &--degree {
            @apply text-sm -mr-1 -mt-1 sm:-mt-2 text-inherit items-start;
          }
        }
      }
    }
  }
}
</style>
