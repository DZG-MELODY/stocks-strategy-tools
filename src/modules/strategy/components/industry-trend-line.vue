<script setup lang="ts">
import { Line, lineY, tip, pointerX, type PlotOptions } from '@observablehq/plot';
import { onMounted, reactive, computed, watch } from 'vue';
import BasePlot from '../../../components/charts/BasePlot.vue';
import { IndustryTrendItem } from 'electron/data/data-storage/low-db/industry-trend';
import { dayToDate } from '../../../utils/time';

const props = withDefaults(defineProps<{
  trends: Array<IndustryTrendItem>,
  industries: Array<string>
}>(),
  {});

const renderData = computed<Array<{ date: Date, industry: string, limit_count: number }>>(() => {
  const line: Array<{ date: Date, industry: string, limit_count: number }> = [];
  props.trends.forEach(t => {
    if (props.industries.length === 0 || props.industries.includes(t.industry)) {
      line.push(...t.trends.map(v => ({ date: dayToDate(v.date), limit_count: v.limit_count, industry: t.industry })));
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

const genLineMarks = (data: Array<{ date: Date, industry: string, limit_count: number }>): Array<Line> => {
  return [
    lineY(data, { x: 'date', y: 'limit_count', stroke: 'industry', strokeWidth: 2, }),
    tip(data, pointerX({ x: 'date', y: 'limit_count' }))
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
  <div class="w-full h-full bg-gray-300 flex flex-col items-center justify-center">
    <BasePlot :options="plotOptions.options" />
  </div>
</template>