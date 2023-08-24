<script setup lang="ts">
import { Line, lineY, PlotOptions, indexOf, tip, pointerX } from '@observablehq/plot';
import { onMounted, reactive } from 'vue';
import BasePlot from './BasePlot.vue';

const aapl = [
  { Date: new Date("2013-05-13"), Open: 64.501427, High: 65.414284, Low: 64.500000, Close: 64.962860, Volume: 79237200 },
  { Date: new Date("2013-05-14"), Open: 64.835716, High: 65.028572, Low: 63.164288, Close: 63.408573, Volume: 111779500 },
  { Date: new Date("2013-05-15"), Open: 62.737144, High: 63.000000, Low: 60.337143, Close: 61.264286, Volume: 185403400 },
  { Date: new Date("2013-05-16"), Open: 60.462856, High: 62.549999, Low: 59.842857, Close: 62.082859, Volume: 150801000 },
  { Date: new Date("2013-05-17"), Open: 62.721428, High: 62.869999, Low: 61.572857, Close: 61.894287, Volume: 106976100 }
];


interface LinePlotOptions {
  options: PlotOptions
}

const plotOptions = reactive<LinePlotOptions>({
  options: {
    style: 'overflow:visible',
    title: 'data title',
    subtitle: 'data sub title',
    caption: 'data caption',
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

const genLineMarks = (data: Array<{ Date: Date, Open: number, High: number, Low: number, Close: number }>): Array<Line> => {
  return [
    lineY(data, { x: indexOf, y: 'High', stroke: 'red', strokeWidth: 2, }),
    lineY(data, { x: indexOf, y: 'Low', stroke: 'green', strokeWidth: 2, }),
    tip(data, pointerX({ x: indexOf, y: 'High' }))
  ];
};

onMounted(() => {
  plotOptions.options.marks = genLineMarks(aapl);
});

const onClickUpdate = () => {
  aapl.splice(0, 1);
  console.log(aapl.length);
  plotOptions.options.marks = genLineMarks(aapl);
  // plot.value = Plot.plot({ marks: [Plot.lineY(aapl, { x: 'Date', y: 'Close' })] })
};


</script>

<template>
  <div class="w-full h-full bg-gray-300 flex flex-col items-center justify-center">
    <BasePlot :options="plotOptions.options" />
    <button @click="onClickUpdate">
      update
    </button>
  </div>
</template>