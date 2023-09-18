<script setup lang="ts">
import { BarY, barY, type PlotOptions } from '@observablehq/plot';
import { onMounted, reactive, computed, watch } from 'vue';
import BasePlot from '../../../components/charts/BasePlot.vue';
import { TopicLimitStockItem } from 'electron/data';

const props = withDefaults(defineProps<{
  stocks: Array<TopicLimitStockItem>,
}>(),
  {
    stocks: () => ([])
  });

const renderData = computed(() => props.stocks);

const plotOptions = reactive<{ options: PlotOptions }>({
  options: {
    // style: 'overflow:visible',
    // title: 'data title',
    // subtitle: 'data sub title',
    // caption: 'data caption',
    margin: 60,
    y: {
      grid: true,
      label: 'count'
    },
    color: {
      legend: true
    },
    marks: []
  }
});

const genLineMarks = (data: Array<TopicLimitStockItem>): Array<BarY> => {
  return [
    barY(data, { x: 'name', y: 'limit_times', fill: 'name', sort: { x: '-y' }, tip: 'x' }),
    // tip(data, pointerX({ x: 'date', y: 'limit_count' }))
  ];
};

onMounted(() => {
  plotOptions.options.marks = genLineMarks(renderData.value);
});

watch(renderData, () => {
  plotOptions.options.marks = genLineMarks(renderData.value);
});


</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center overflow-scroll">
    <BasePlot :options="plotOptions.options" />
  </div>
</template>