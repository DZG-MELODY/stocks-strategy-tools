<script setup lang="ts">
import { ref } from 'vue';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';
import stockAnalyzeChart from './components/stock-analyze-chart.vue';
import { useMessage } from 'naive-ui';
import { convertToDay } from '../../utils/time';
import { StockOfDailyItem } from 'electron/data';
import { useRoute } from 'vue-router';

defineOptions({ name: 'StockAnalyze' });
const route = useRoute();
const { code, name } = route.query as { code: string, name: string };
const message = useMessage();
const range = ref<[number, number]>([Date.now() - 1000 * 3600 * 24 * 90, Date.now()]);
const stockInfo = ref<{ code: string, name: string }>({ code: code || '', name: name || '' });
const stockData = ref<{ data: Array<StockOfDailyItem> }>({ data: [] });

const onClickFetch = async () => {
  if (!stockInfo.value.code) return message.error('证券代码不能空');
  const [success, result] = await window.dataFetcher.fetch('getDailyDataForStock', {
    code: stockInfo.value.code,
    start: convertToDay(range.value[0]),
    end: convertToDay(range.value[1])
  });
  if (success === false) return message.error(result);
  console.log(result);
  if (result._tag === 'StockOfDaily') stockData.value.data = result.items;
};

</script>

<template>
  <vertical-layout>
    <template #header>
      <n-space class="h-full w-full mx-3" justify="end" align="center">
        <n-input v-model:value="stockInfo.code" type="text" placeholder="输入股票代码"></n-input>
        <n-date-picker v-model:value="range" type="daterange" clearable />
        <n-button size="small" @click="onClickFetch">获取数据</n-button>
      </n-space>
    </template>
    <div class="w-full h-full p-3 flex flex-row overflow-hidden">
      <div class="flex-1 h-full">
        <stock-analyze-chart v-if="stockData.data.length > 0" :stocks-data="stockData.data"></stock-analyze-chart>
        <n-empty v-else class="w-full h-full justify-center" description="暂无数据">
        </n-empty>
      </div>
      <div class="w-60 h-full overflow-y-auto border-l-2 border-green-500 pl-3">
      </div>
    </div>
  </vertical-layout>
</template>