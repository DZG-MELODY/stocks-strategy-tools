<script setup lang="ts">
import { fetchLimitHistoryForDay, BaseTuShareRes, LimitListDayRes } from '../../node-libs/data-fetch/tu-share';
import { setLimitHistory } from '../../node-libs/data-storage/low-db';


defineOptions({ name: 'StrategyPage' });

const onClickUpdate = async () => {
  const ret = (await fetchLimitHistoryForDay('20230901')) as BaseTuShareRes<LimitListDayRes>;
  await setLimitHistory('20230901', ret.data.items);
  console.log(ret);
};

</script>

<template>
  <div>
    <button @click="onClickUpdate">拉取数据</button>
  </div>
</template>