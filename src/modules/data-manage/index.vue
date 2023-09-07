<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';
import { type LimitForDay } from '../../../electron/data';

defineOptions({ name: 'DataManage' });
const router = useRouter();
const selectTimeValue = ref<number>(Date.now());
const selectDayTime = computed(() =>{
  const selectDate = new Date(selectTimeValue.value);
  return   `${selectDate.getFullYear()}${(selectDate.getMonth()+1).toString().padStart(2, '0')}${selectDate.getDate().toString().padStart(2, '0')}`;
});

const onClickUpdate = async () => {
  const [success, result] = await window.dataFetcher.fetch('limitHistory', { day: selectDayTime.value });
  if (success === true) {
    const row = (result as LimitForDay);
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
      <n-space class="h-full mx-3" justify="end" align="center">
        <span>选择时间：{{ selectDayTime }}</span>
        <n-button size="small" @click="onClickUpdate">拉取数据</n-button>
        <n-button size="small" @click="onClickBack">返回主页</n-button>
      </n-space>
    </template>
    <n-calendar
      v-model:value="selectTimeValue" 
      class="h-full mx-3"
      #="{ year, month, date }">
      {{ year }}-{{ month }}-{{ date }}
    </n-calendar>
  </vertical-layout>
</template>