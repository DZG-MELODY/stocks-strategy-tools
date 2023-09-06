<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';
import { type LimitForStock, type LimitForDay } from '../../../electron/data';

defineOptions({ name: 'StrategyPage' });
const router = useRouter();
const stocks = ref<Array<LimitForStock>>([]);

const columnConfig = [
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

const onClickUpdate = async () => {
  const [success, result] = await window.dataFetcher.fetch('limitHistory', { day: '20230901' });
  if (success === true) {
    const row = (result as LimitForDay);
    stocks.value = row.items;
    console.log(row.date, row.items);
  }
};

const onClickBack = () => {
  router.push({ name: 'home' });
};

</script>

<template>
  <vertical-layout>
    <template #header>
      <n-space class="h-full" justify="end" align="center">
        <n-button size="small" @click="onClickUpdate">拉取数据</n-button>
        <n-button size="small" @click="onClickBack">返回主页</n-button>
      </n-space>
    </template>
    <n-data-table class="h-full" :columns="columnConfig" :data="stocks" size="small" max-height="100%" flex-height>
    </n-data-table>
  </vertical-layout>
</template>