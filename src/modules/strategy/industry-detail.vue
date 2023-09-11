<script setup lang="ts">
import { ref, onMounted,computed } from 'vue';
import { useRoute } from 'vue-router';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';
import IndustryKeyBar from './components/industry-key-bar.vue';
import { IndustryLimitStockItem } from 'electron/data';

const route = useRoute();
const stocks = ref<Array<IndustryLimitStockItem>>([]);
const days = ref<Array<string>>([]);
const selectDay = ref('');
const stocksForDay = computed<Array<IndustryLimitStockItem>>(()=>stocks.value.filter(v=>v.date===selectDay.value));


const columnConfig = [
  // {
  //   title: '日期',
  //   key: 'date'
  // },
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
    title: '连板数',
    key: 'limit_times'
  },
  {
    title: '涨跌幅',
    key: 'pct_chg'
  },
  {
    title: '换手率',
    key: 'turnover_ratio'
  }
];

onMounted(async () => {
  const { industry, start, end } = route.params as { industry: string, start: string, end: string };
  try {
    const [success, result] = await window.dataFetcher.fetch('getIndustryLimitStocks', { industry, start, end });
    if (!success) return;
    if (result._tag !== 'IndustryLimitStocks') return;
    stocks.value = result.items;
    days.value = result.days;
    selectDay.value = days.value[0];
  } catch (error) {
    console.log(error);
  }

});

</script>


<template>
  <vertical-layout>
    <template #header>
      <n-space class="h-full w-full mx-3" justify="end" align="center">
      </n-space>
    </template>
    <div class="w-full h-full p-3 flex flex-row overflow-hidden">
      <div class="h-full w-1/2">
        <industry-key-bar :stocks="stocksForDay"></industry-key-bar>
      </div>
      <div class="h-full flex-1">
        <n-data-table class="h-full" :columns="columnConfig" :data="stocks" size="small" max-height="100%" flex-height>
        </n-data-table>
      </div>
      <div class="h-full w-28 overflow-y-auto">
        <n-radio-group v-model:value="selectDay" class="w-full" size="small" name="selectDays">
          <n-space vertical align="center">
            <n-radio-button v-for="day in days" :key="day" size="small" :value="day" :label="day" />
          </n-space>
        </n-radio-group>
      </div>
    </div>
  </vertical-layout>
</template>