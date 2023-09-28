<script setup lang="ts">
import { ruleX, type PlotOptions, RuleX } from '@observablehq/plot';
import { onMounted, reactive, computed, watch } from 'vue';
import BasePlot from '../../../components/charts/BasePlot.vue';
import { StockOfDailyItem } from 'electron/data';

const props = withDefaults(defineProps<{
  stocksData: Array<StockOfDailyItem>,
}>(),
  {
    stocksData: () => ([])
  });

const renderData = computed(() => props.stocksData);

const plotOptions = reactive<{ options: PlotOptions }>({
  options: {
    width: 1024,
    margin: 60,
    grid: true,
    x: {
      type: 'point',
      tickRotate: 90,
      label: null
    },
    y: {},
    color: {
      domain: [-1, 0, 1],
      range: ["#4daf4a", "#000000", "#e41a1c"]
    },
    marks: []
  }
});

const genLineMarks = (data: Array<StockOfDailyItem>): Array<RuleX> => {
  return [
    ruleX(data, { x: 'trade_date', y1: 'low', y2: 'high', stroke: (d: StockOfDailyItem) => d.close !== d.open ? Math.sign(d.close - d.open) : Math.sign(d.high - d.low), }),
    ruleX(data, {
      x: 'trade_date', y1: 'open', y2: (d: StockOfDailyItem) => d.close === d.open ? (d.high >= d.low ? d.close * 1.001 : d.close * 0.999) : d.close,
      stroke: (d: StockOfDailyItem) => d.close !== d.open ? Math.sign(d.close - d.open) : Math.sign(d.high - d.low),
      strokeWidth: 6,
      tip: 'x'
    })
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