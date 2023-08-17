<script setup lang="ts">
import {  Line, lineY } from '@observablehq/plot';
import { onMounted, reactive } from 'vue';
import BasePlot from './BasePlot.vue';

const aapl = [
  { Date: new Date("2013-05-13"), Open: 64.501427, High: 65.414284, Low: 64.500000, Close: 64.962860, Volume: 79237200 },
  { Date: new Date("2013-05-14"), Open: 64.835716, High: 65.028572, Low: 63.164288, Close: 63.408573, Volume: 111779500 },
  { Date: new Date("2013-05-15"), Open: 62.737144, High: 63.000000, Low: 60.337143, Close: 61.264286, Volume: 185403400 },
  { Date: new Date("2013-05-16"), Open: 60.462856, High: 62.549999, Low: 59.842857, Close: 62.082859, Volume: 150801000 },
  { Date: new Date("2013-05-17"), Open: 62.721428, High: 62.869999, Low: 61.572857, Close: 61.894287, Volume: 106976100 }
];

// const plot = ref(Plot.plot({ marks: [lineY(aapl, { x: 'Date', y: 'Close' })] }))
// const plotEle = ref<HTMLDivElement | null>(null);
interface LinePlotOptions {
  id?: number
  options: { marks: Array<Line> }
}

const plotOptions = reactive<LinePlotOptions>({
  id: Date.now(),
  options: {
    marks: []
  }
});

onMounted(() => {
  plotOptions.options.marks = [lineY(aapl, { x: 'Date', y: 'Close' })];
  // if (plotEle.value === null) return
  // plotEle.value.append(plot.value)
});

const onClickUpdate = () => {
  aapl.splice(0, 1);
  console.log(aapl.length);
  plotOptions.options.marks = [lineY(aapl, { x: 'Date', y: 'Close' })];
  plotOptions.id = Date.now();
  // plot.value = Plot.plot({ marks: [Plot.lineY(aapl, { x: 'Date', y: 'Close' })] })
};


</script>

<template>
  <div ref="plotEle">
    placeholder
  </div>
  <BasePlot :options="plotOptions.options" />
  <button @click="onClickUpdate">
    update
  </button>
</template>