<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';
import IndustryTrendLine from './components/industry-trend-line.vue';
import { convertToDay } from '../../utils/time';
import { IndustryTrendItem } from 'electron/data/data-storage/low-db/industry-trend';

defineOptions({ name: 'StrategyPage' });
const router = useRouter();
const range = ref<[number, number]>([Date.now() - 1000 * 3600 * 24 * 14, Date.now()]);
const trendData = reactive<{ industries: Array<string>, industryOptions: Array<{ label: string, value: string }>, trends: Array<IndustryTrendItem> }>({
  industryOptions: [],
  industries: [],
  trends: []
});

const onClickFetch = async () => {
  const [success, result] = await window.dataFetcher.fetch('getIndustryTrend', { start: convertToDay(range.value[0]), end: convertToDay(range.value[1]) });
  if (success === true && result._tag === 'IndustryTrend') {
    trendData.industryOptions = result.items.map(v => ({ label: v.industry, value: v.industry }));
    trendData.trends = result.items;
  }
};

const onClickFilterForToday = () => {
  const today = convertToDay(range.value[1]);
  const industryForToday = trendData.trends.filter(v => v.trends.find(t => t.date === today)?.limit_count || 0 > 1).map(i => i.industry);
  trendData.industries = industryForToday;
};

const onClickToIndustryDetail = (industry: string) => {
  router.push({
    name: 'industry-detail',
    params:{
      industry,
      start: convertToDay(range.value[0]),
      end: convertToDay(range.value[1])
    }
  }).catch((err)=>console.log(err.message));
};

</script>

<template>
  <vertical-layout>
    <template #header>
      <n-space class="h-full w-full mx-3" justify="end" align="center">
        <n-date-picker v-model:value="range" type="daterange" clearable />
        <n-button size="small" @click="onClickFetch">获取数据</n-button>
        <n-button size="small" @click="onClickFilterForToday">今日热点</n-button>
      </n-space>
    </template>
    <div class="w-full h-full p-3 flex flex-row overflow-hidden">
      <div class="flex-1 h-full">
        <industry-trend-line
v-if="trendData.trends.length > 0" :trends="trendData.trends"
          :industries="trendData.industries"></industry-trend-line>
      </div>
      <div class="w-40 h-full overflow-y-auto border-l-2 border-green-500 pl-3">
        <n-checkbox-group v-model:value="trendData.industries">
          <n-grid :y-gap="8" :cols="1">
            <n-gi v-for="option in trendData.industryOptions" :key="option.label">
              <n-checkbox :value="option.value" :label="option.label" />
              <n-button size="tiny" type="info" @click="onClickToIndustryDetail(option.value)">详情</n-button>
            </n-gi>
          </n-grid>
        </n-checkbox-group>
      </div>
    </div>
  </vertical-layout>
</template>