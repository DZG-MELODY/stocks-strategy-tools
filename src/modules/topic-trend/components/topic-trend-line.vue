<script setup lang="ts">
import { Line, lineY, type PlotOptions } from '@observablehq/plot';
import { onMounted, reactive, computed, watch } from 'vue';
import BasePlot from '../../../components/charts/BasePlot.vue';
import { TopicTrendItem } from 'electron/data';

const props = withDefaults(defineProps<{
  trends: Array<TopicTrendItem>,
  topics: Array<string>
}>(),
  {});


const renderData = computed<Array<{ date: string, topic: string, limit_count: number }>>(() => {
  const line: Array<{ date: string, topic: string, limit_count: number }> = [];
  props.trends.forEach(t => {
    if (props.topics.length === 0 || props.topics.includes(t.topic)) {
      line.push(...t.trends.map(v => ({ date: v.date.slice(4), limit_count: v.limit_count, topic: t.topic })));
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
      legend: true
    },
    marks: []
  }
});

const genLineMarks = (data: Array<{ date: string, topic: string, limit_count: number }>): Array<Line> => {
  return [
    lineY(data, { x: 'date', y: 'limit_count', stroke: 'topic', strokeWidth: 2, tip: 'xy' }),
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