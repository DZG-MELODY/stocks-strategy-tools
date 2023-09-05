<script setup lang="ts">
import { ref } from 'vue';
import { fetchLimitHistoryForDay, covertStockItem } from '../../node-libs/data-fetch/df-share';
import { setLimitHistory } from '../../node-libs/data-storage/low-db';
import { HTTPResponseError } from '../../node-libs/request';


defineOptions({ name: 'StrategyPage' });
const dayStr = ref('');

const onClickUpdate = async () => {
  const ret = await fetchLimitHistoryForDay(dayStr.value);
  if (ret instanceof HTTPResponseError) {
    console.log(ret.message);
  } else if (ret.data !== null) {
    await setLimitHistory(dayStr.value, (ret.data?.pool || []).map(v => covertStockItem(v)));
    console.log('update success');
  }
};

</script>

<template>
  <div>
    <input v-model="dayStr" type="text">
    <button @click="onClickUpdate">拉取数据</button>
  </div>
</template>