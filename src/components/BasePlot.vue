<script lang="ts" setup>
import { type PlotOptions, plot } from "@observablehq/plot";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{ options: PlotOptions }>();
const plotRoot = ref<null | HTMLElement>(null);
const plotElement = ref<null | ReturnType<typeof plot>>(null);

onMounted(() => {
  if (plotRoot.value === null) return;
  plotElement.value = plot(props.options);
  plotRoot.value?.append(plotElement.value);
});

onBeforeUnmount(() => {
  if (plotElement.value) plotElement.value.remove();
  plotElement.value = null;
});

watch(props.options, () => {
  if (plotElement.value) plotElement.value.remove();
  plotElement.value = plot(props.options);
  plotRoot.value?.append(plotElement.value);
});

</script>
<template>
  <div ref="plotRoot" />
</template>