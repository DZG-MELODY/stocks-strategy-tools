<script setup lang="ts">
import { LimitForDay } from 'electron/data/data-storage/low-db';
import { ref } from 'vue';


defineOptions({ name: 'StrategyPage' });
const dayStr = ref('');

const onClickUpdate = async () => {
  const [success, result] = await window.dataFetcher.fetch('limitHistory', { day: '20230901' });
  if (success === true) {
    const row = (result as LimitForDay);
    console.log(row.date, row.items);
  }
};

</script>

<template>
  <div>
    <input v-model="dayStr" type="text">
    <button @click="onClickUpdate">拉取数据</button>
  </div>
</template>