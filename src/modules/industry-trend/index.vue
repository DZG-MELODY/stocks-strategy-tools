<script setup lang="ts">
import { ref, reactive } from 'vue';
import VerticalLayout from '../../components/layout/VerticalLayout.vue';
import IndustryTrendLine from './components/industry-trend-line.vue';
import IndustryDetail from './components/industry-detail.vue';
import { convertToDay } from '../../utils/time';
import { IndustryTrendItem } from 'electron/data';

defineOptions({ name: 'IndustryTrend' });
const range = ref<[number, number]>([Date.now() - 1000 * 3600 * 24 * 14, Date.now()]);
const trendData = reactive<{ industries: Array<string>, industryOptions: Array<{ label: string, value: string }>, trends: Array<IndustryTrendItem> }>({
  industryOptions: [],
  industries: [],
  trends: []
});
const limitFilterCount = ref(1);
const detailOptions = reactive<{ industry: string, start: string, end: string, visible: boolean }>({ industry: '', start: '', end: '', visible: false });

const onClickFetch = async () => {
  const [success, result] = await window.dataFetcher.fetch('getIndustryTrend', { start: convertToDay(range.value[0]), end: convertToDay(range.value[1]) });
  if (success === true && result._tag === 'IndustryTrend') {
    trendData.industryOptions = result.items.map(v => ({ label: v.industry, value: v.industry }));
    trendData.trends = result.items;
  }
};

const onClickFilterForToday = () => {
  const today = convertToDay(range.value[1]);
  const industryForToday = trendData.trends.filter(v => (v.trends.find(t => t.date === today)?.limit_count || 0) >= limitFilterCount.value).map(i => i.industry);
  trendData.industries = industryForToday;
};

const onClickToIndustryDetail = (industry: string) => {
  detailOptions.industry = industry;
  detailOptions.start = convertToDay(range.value[0]);
  detailOptions.end = convertToDay(range.value[1]);
  detailOptions.visible = true;
};

</script>

<template>
  <vertical-layout>
    <template #header>
      <n-space class="h-full w-full mx-3" justify="end" align="center">
        <n-date-picker v-model:value="range" type="daterange" clearable />
        <n-button size="small" @click="onClickFetch">获取数据</n-button>
        <n-button size="small" @click="onClickFilterForToday">按涨停数过滤</n-button>
        <n-input-number v-model:value="limitFilterCount" size="small" :min="0" :max="30" placeholder="过滤涨停数" />
      </n-space>
    </template>
    <industry-detail
v-model:visible="detailOptions.visible" :industry-trend="trendData.trends"
      :industry="detailOptions.industry" :start="detailOptions.start" :end="detailOptions.end">
    </industry-detail>
    <div class="w-full h-full p-3 flex flex-row overflow-hidden">
      <div class="flex-1 h-full">
        <industry-trend-line
v-if="trendData.trends.length > 0" :trends="trendData.trends"
          :industries="trendData.industries"></industry-trend-line>
        <n-empty v-else class="w-full h-full justify-center" description="暂无数据">
        </n-empty>
      </div>
      <div class="w-40 h-full overflow-y-auto border-l-2 border-green-500 pl-3">
        <n-checkbox-group v-model:value="trendData.industries">
          <n-grid :y-gap="8" :cols="1">
            <n-gi>
              <span class="font-bold mr-2">行业列表</span>
              <n-button size="tiny" @click="trendData.industries = []">重置</n-button>
            </n-gi>
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