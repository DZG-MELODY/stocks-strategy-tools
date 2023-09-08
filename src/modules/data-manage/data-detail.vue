<script setup lang="ts">
import { ref } from 'vue';
import { type LimitForStock } from '../../../electron/data';


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
</script>

<template>
    <n-data-table class="h-full" :columns="columnConfig" :data="stocks" size="small" max-height="100%" flex-height>
    </n-data-table>
</template>