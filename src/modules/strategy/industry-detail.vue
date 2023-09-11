<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';
import { IndustryLimitStockItem } from 'electron/data';

const route = useRoute();
const stocks = ref<Array<IndustryLimitStockItem>>([]);

const columnConfig = [
  {
    title: '日期',
    key: 'date'
  },
  {
    title: '代码',
    key: 'code'
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '行业',
    key: 'industry'
  },
  {
    title: '涨跌幅',
    key: 'pct_chg'
  }
];

onMounted(async () => {
  const { industry, start, end } = route.params as { industry: string, start: string, end: string };
  const [success, result] = await window.dataFetcher.fetch('getIndustryLimitStocks', { industry, start, end });
  if (!success) return;
  if (result._tag !== 'IndustryLimitStocks') return;
  stocks.value = result.items;
});

</script>


<template>
  <vertical-layout>
    <template #header>
      <n-space class="h-full w-full mx-3" justify="end" align="center">
      </n-space>
    </template>
    <div class="w-full h-full p-3 flex flex-row overflow-hidden">
      <n-data-table class="h-full" :columns="columnConfig" :data="stocks" size="small" max-height="100%" flex-height>
      </n-data-table>
    </div>
  </vertical-layout>
</template>