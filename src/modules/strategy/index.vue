<script setup lang="ts">
import { useRouter } from 'vue-router';
import { type LimitForStock, type LimitForDay } from '../../../electron/data';
import { ref } from 'vue';

defineOptions({ name: 'StrategyPage' });
const dayStr = ref('');
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
  <div class="w-full h-full overflow-y-auto">
    <input v-model="dayStr" type="text">
    <!-- <button @click="onClickUpdate">拉取数据</button> -->
    <NButton type="primary" @click="onClickUpdate">拉取数据</NButton>
    <NButton type="primary" @click="onClickBack">返回主页</NButton>
    <NDataTable :columns="columnConfig" :data="stocks" virtual-scroll></NDataTable>
  </div>
</template>