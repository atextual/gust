<template>
  <div class="zone-list">
    <ZoneCard v-for="zone in zones" :key="zone.number" :zone="zone" />
  </div>
</template>

<script lang="ts" setup>
const systemStore = useSystemStore();
const zones = computed(() => systemStore.getZones);
</script>

<style scoped>
.zone-list {
  @apply justify-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 z-10;
}
</style>
