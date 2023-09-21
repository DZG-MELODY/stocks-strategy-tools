<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';
import HeadKeyBar from './components/head-key-bar.vue';
import { convertToDay } from '../../utils/time';
import { LimitForStock } from 'electron/data';

defineOptions({ name: 'TopicTrend' });
const selectTime = ref<number>(Date.now());
const selectDay = computed(() => convertToDay(selectTime.value));
const headData = reactive<{ selectStock: string, trends: Array<LimitForStock>, limitData: Array<LimitForStock> }>({
  selectStock: '',
  limitData: [],
  trends: []
});
const currentStock = computed<null | LimitForStock>(() => {
  if (!headData.selectStock) return null;
  return headData.limitData.find(v => v.name === headData.selectStock) || null;
});

const headOptions = computed<Array<{ label: string, value: string, meta: { limit_times: number } }>>(() => headData.trends.map(v => ({ label: v.name, value: v.name, meta: { limit_times: v.limit_times } })));
const limitTimesFilterCount = ref(2);

const onClickFetch = async () => {
  const [success, result] = await window.dataFetcher.fetch('getLimitHistory', { day: selectDay.value });
  if (success === true && result._tag === 'LimitForDay') {
    headData.limitData = result.items.map(v => ({ ...v }));
    headData.trends = headData.limitData;
  }
};

const onClickFilterForToday = () => {
  headData.trends = headData.limitData.filter(v => v.limit_times >= limitTimesFilterCount.value);
};


</script>

<template>
  <vertical-layout>
    <template #header>
      <n-space class="h-full w-full mx-3" justify="end" align="center">
        <n-date-picker v-model:value="selectTime" type="date" />
        <n-button size="small" @click="onClickFetch">获取数据</n-button>
        <n-button size="small" @click="onClickFilterForToday">按连板数过滤</n-button>
        <n-input-number v-model:value="limitTimesFilterCount" size="small" :min="0" :max="15" placeholder="过滤连板数" />
      </n-space>
    </template>
    <div class="w-full h-full p-3 flex flex-row overflow-hidden">
      <div class="flex-1 h-full flex flex-col">
        <div class="w-full h-3/4">
          <head-key-bar v-if="headData.limitData.length > 0" :stocks="headData.limitData">
          </head-key-bar>
          <n-empty v-else class="w-full h-full justify-center" description="暂无数据">
          </n-empty>
        </div>
        <div class="w-full h-1/4 border-t-2 border-green-500 overflow-auto">
          <n-descriptions v-if="currentStock !== null" label-placement="top" title="详情" bordered :column="6">
            <n-descriptions-item label="换手">
              {{ currentStock.turnover_ratio }}
            </n-descriptions-item>
            <n-descriptions-item label="炸板">
              {{ currentStock.has_fail ? '是' : '否' }}
            </n-descriptions-item>
            <n-descriptions-item label="行业">
              <n-tag type="primary">{{ currentStock.industry }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="题材">
              <n-tag v-for="topic in currentStock.tdx_topics" :key="topic" type="info">{{ topic }}</n-tag>
            </n-descriptions-item>
          </n-descriptions>
        </div>
      </div>
      <div class="w-60 h-full overflow-y-auto border-l-2 border-green-500 pl-3">
        <n-radio-group v-model:value="headData.selectStock">
          <n-grid :y-gap="8" :cols="1">
            <n-gi>
              <span class="font-bold mr-2">涨停列表</span>
            </n-gi>
            <n-gi v-for="option in headOptions" :key="option.label">
              <n-radio-button :value="option.value" :label="`${option.label}(${option.meta.limit_times})`" />
            </n-gi>
          </n-grid>
        </n-radio-group>
      </div>
    </div>
  </vertical-layout>
</template>