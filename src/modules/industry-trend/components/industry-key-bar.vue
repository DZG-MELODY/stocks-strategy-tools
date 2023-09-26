<script setup lang="ts">
import { BarY, barY, type PlotOptions } from '@observablehq/plot';
import { onMounted, reactive, computed, watch } from 'vue';
import BasePlot from '../../../components/charts/BasePlot.vue';
import { IndustryLimitStockItem } from 'electron/data';

const props = withDefaults(defineProps<{
  stocks: Array<IndustryLimitStockItem>,
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
    x: {
      paddingInner: 0.5,
      tickRotate: 45
    },
    y: {
      grid: true,
      label: '连板数',
      domain: [0, 15],
      interval: 1
    },
    color: {
      legend: false
    },
    marks: []
  }
});

const genLineMarks = (data: Array<IndustryLimitStockItem>): Array<BarY> => {
  return [
    barY(data, { x: 'name', y: 'limit_times', fill: 'name', sort: { x: '-y' }, tip: 'x' }),
    // tip(data, pointerX({ x: 'date', y: 'limit_count' }))
  ];
};

onMounted(() => {
  console.log(props.stocks);
  plotOptions.options.marks = genLineMarks(renderData.value);
});

watch(renderData, () => {
  console.log(props.stocks);
  plotOptions.options.marks = genLineMarks(renderData.value);
});


</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center overflow-scroll">
    <BasePlot :options="plotOptions.options" />
  </div>
</template>