<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import VerticalLayout from '../../../components/layout/VerticalLayout.vue';
import TopicKeyBar from './topic-key-bar.vue';
import TopicTrendLine from './topic-trend-line.vue';
import { TopicLimitStockItem, TopicTrendItem } from 'electron/data';

const stocks = ref<Array<TopicLimitStockItem>>([]);
const days = ref<Array<string>>([]);
const selectDay = ref('');
const stocksForDay = computed<Array<TopicLimitStockItem>>(() => stocks.value.filter(v => v.date === selectDay.value));

const props = defineProps<{
  industryTrend: Array<TopicTrendItem>,
  industry: string,
  start: string,
  end: string,
  visible: boolean
}>();

const emits = defineEmits(['update:visible']);

const columnConfig = [
  // {
  //   title: '日期',
  //   key: 'date'
  // },
  {
    title: '代码',
    key: 'code'
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '题材(tdx)',
    key: 'tdx_topics'
  },
  {
    title: '连板数',
    key: 'limit_times'
  },
  {
    title: '涨跌幅',
    key: 'pct_chg'
  },
  {
    title: '换手率',
    key: 'turnover_ratio'
  }
];

const updateData = async () => {
  const { industry, start, end } = props;
  try {
    const [success, result] = await window.dataFetcher.fetch('getTopicLimitStocks', { industry, start, end });
    if (!success) return;
    if (result._tag !== 'TopicLimitStocks') return;
    stocks.value = result.items;
    days.value = result.days;
    selectDay.value = days.value[0];
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  updateData();
});

watch(() => props.visible, (v) => {
  if (v === true) updateData();
});

</script>


<template>
  <n-modal :show="visible">
    <vertical-layout class="bg-slate-50" style="position:absolute;" :inline-buttons="[]">
      <template #header>
        <n-space class="h-full w-full mx-3" justify="end" align="center">
          <n-button size="small" @click="emits('update:visible', false)">关闭</n-button>
        </n-space>
      </template>
      <div class="w-full h-full p-3 flex flex-row justify-between overflow-hidden">
        <div class="h-full flex-1 flex flex-col justify-between gap-3">
          <div class="h-3/4 w-full flex flex-row justify-between">
            <div class="h-full w-1/2">
              <topic-trend-line
v-if="industryTrend.length > 0" :trends="industryTrend"
                :topics="[industry]"></topic-trend-line>
              <n-empty v-else description="暂无数据" class="w-full h-full justify-center"></n-empty>
            </div>
            <div class="h-full w-1/2">
              <topic-key-bar v-if="stocksForDay.length > 0" :stocks="stocksForDay"></topic-key-bar>
              <n-empty v-else description="暂无数据" class="w-full h-full justify-center"></n-empty>
            </div>
          </div>
          <div class="h-1/4 w-full">
            <n-data-table
class="h-full" :columns="columnConfig" :data="stocksForDay" size="small" max-height="100%"
              flex-height>
            </n-data-table>
          </div>

        </div>
        <div class="h-full w-32 flex-grow-0 overflow-y-auto">
          <n-radio-group v-model:value="selectDay" class="w-full" size="small" name="selectDays">
            <n-space vertical align="center">
              <n-radio-button v-for="day in days" :key="day" size="small" :value="day" :label="day" />
            </n-space>
          </n-radio-group>
        </div>
      </div>
    </vertical-layout>

  </n-modal>
</template>