<script setup lang="ts">
import { Line, lineY, type PlotOptions } from '@observablehq/plot';
import { onMounted, reactive, computed, watch } from 'vue';
import BasePlot from '../../../components/charts/BasePlot.vue';
import { IndustryTrendItem } from 'electron/data';

const props = withDefaults(defineProps<{
  trends: Array<IndustryTrendItem>,
  industries: Array<string>,
  showLegend?: boolean
}>(),
  { showLegend: true });


const renderData = computed<Array<{ date: string, industry: string, limit_count: number }>>(() => {
  const line: Array<{ date: string, industry: string, limit_count: number }> = [];
  props.trends.forEach(t => {
    if (props.industries.length === 0 || props.industries.includes(t.industry)) {
      line.push(...t.trends.map(v => ({ date: v.date.slice(4), limit_count: v.limit_count, industry: t.industry })));
    }
  });
  return line;
});


const plotOptions = reactive<{ options: PlotOptions }>({
  options: {
    // style: 'overflow:visible',
    // title: 'data title',
    // subtitle: 'data sub title',
    // caption: 'data caption',
    width: 1024,
    margin: 60,
    x: {
      grid: true,
      type: 'point',
    },
    y: {
      grid: true,
      label: 'count',
      interval: 1,
      domain: [0, 20]
    },
    color: {
      legend: props.showLegend
    },
    marks: []
  }
});

const genLineMarks = (data: Array<{ date: string, industry: string, limit_count: number }>): Array<Line> => {
  return [
    lineY(data, { x: 'date', y: 'limit_count', stroke: 'industry', strokeWidth: 2, tip: 'xy' }),
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