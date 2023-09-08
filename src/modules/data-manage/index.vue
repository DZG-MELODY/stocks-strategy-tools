<script setup lang="ts">
// import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useMessage } from 'naive-ui';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';

defineOptions({ name: 'DataManage' });
// const router = useRouter();
const message = useMessage();
const selectTimeValue = ref<number>(Date.now());
const selectDayTime = computed(() => {
  const selectDate = new Date(selectTimeValue.value);
  return `${selectDate.getFullYear()}${(selectDate.getMonth() + 1).toString().padStart(2, '0')}${selectDate.getDate().toString().padStart(2, '0')}`;
});

const dateDisabledFn = (date: number) => {
  const dateObj = new Date(date);
  return dateObj.getDay() === 0 || dateObj.getDay() === 6;
};

const onClickUpdate = async () => {
  const [success, result] = await window.dataFetcher.fetch('updateLimitForDay', { day: selectDayTime.value });
  if (success === true && result._tag === 'LimitForDay') {
    message.success(`${result.date} 更新完毕`);
    console.log(result.date, result.items);
  } else {
    message.error('数据更新失败');
    console.log(result);
  }
};

</script>

<template>
  <vertical-layout>
    <template #header>
      <n-space class="h-full w-full mx-3" justify="end" align="center">
        <span>选择时间：{{ selectDayTime }}</span>
        <n-button size="small" @click="onClickUpdate">拉取数据</n-button>
      </n-space>
    </template>
    <n-calendar
v-model:value="selectTimeValue" :is-date-disabled="dateDisabledFn" class="h-full mx-3"
      #="{ year, month, date }">
      {{ year }}-{{ month }}-{{ date }}
    </n-calendar>
  </vertical-layout>
</template>