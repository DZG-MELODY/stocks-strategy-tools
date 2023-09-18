import { LimitForStock } from './limit-history';
import { getTable } from './utils';


export type LimitForStockWithTopics = LimitForStock & { tdx_topics: Array<string>, ths_topics: Array<string> }

export type LimitForTopic = {
  _tag: 'LimitForTopic',
  // 行业板块
  topic: string,
  // 涨停个数
  limit_count: number,
  // 涨停股
  limit_stocks: Array<LimitForStockWithTopics>
}

export type TopicTrendForDay = {
  _tag: 'TopicTrendForDay',
  // 日期
  date: string,
  // 行业趋势项
  items: Array<LimitForTopic>
}


const calcTopicTrendForDay = (items: Array<LimitForStockWithTopics>, type: 'tdx' | 'ths' = 'tdx'): Array<LimitForTopic> => {
  const topicSet = new Map<string, LimitForTopic>();
  items.forEach((v) => {
    const topics = type === 'tdx' ? v.tdx_topics : v.ths_topics;
    topics.forEach(topic => {
      if (!topicSet.has(topic)) topicSet.set(topic, { _tag: 'LimitForTopic', topic: topic, limit_count: 0, limit_stocks: [] });
      const item = topicSet.get(topic);
      item.limit_count += 1;
      item.limit_stocks.push(v);
    });
  });
  return Array.from(topicSet.values());
};


export const setTopicTrendForDay = async (date: string, items: Array<LimitForStockWithTopics>) => {
  const table = await getTable('DB_TOPIC_TREND');
  if (table.data.name !== 'topic-trend') return false;
  const row = table.data.rows.find(v => v.date === date);
  if (row) {
    row.items = calcTopicTrendForDay(items);
  } else {
    table.data.rows.push({
      _tag: 'TopicTrendForDay',
      date: date,
      items: calcTopicTrendForDay(items)
    });
  }
  await table.write();
};

export const getTopicTrendForRange = async (start: string, end: string) => {
  const table = await getTable('DB_TOPIC_TREND');
  if (table.data.name !== 'topic-trend') return false;
  const rows = table.data.rows.filter(v => v.date >= start && v.date <= end).map(v => ({ ...v })).sort((v1, v2) => v1.date > v2.date ? 1 : -1);
  return rows;
};

export type TopicTrendItem = {
  topic: string,
  trends: Array<{
    date: string,
    limit_count: number
  }>
}

export type TopicTrend = {
  _tag: 'TopicTrend',
  items: Array<TopicTrendItem>
}

// 计算题材趋势时间线
export const calcTopicTrendForTimeline = (limitForRange: Array<TopicTrendForDay>): TopicTrend => {
  const topicMap = new Map<string, Array<{ date: string, limit_count: number }>>;
  const timeLen = limitForRange.length;
  // 占位记录
  const placeholderItems: Array<{ date: string, limit_count: number }> = [];
  for (let i = 0; i < timeLen; i++) {
    const { date, items } = limitForRange[i];
    items.forEach(v => {
      if (topicMap.has(v.topic)) {
        topicMap.get(v.topic).push({ date: date, limit_count: v.limit_count });
      } else {
        //补充前零值
        topicMap.set(v.topic, [...placeholderItems, { date: date, limit_count: v.limit_count }]);
      }
    });
    // 补充后零值
    topicMap.forEach(item => {
      if (item.length === i) item.push({ date: date, limit_count: 0 });
    });
    placeholderItems.push({ date: date, limit_count: 0 });
  }
  return {
    _tag: 'TopicTrend',
    items: Array.from(topicMap.entries()).map(([topic, items]) => ({ topic, trends: items }))
  };
};


export type TopicLimitStockItem = LimitForStockWithTopics & { date: string }
export type TopicLimitStocks = { _tag: 'TopicLimitStocks', items: Array<TopicLimitStockItem>, days: Array<string> }

export const getLimitStocksForTopic = async (topic: string, start: string, end: string): Promise<TopicLimitStocks | false> => {
  const rows = await getTopicTrendForRange(start, end);
  if (rows === false) return false;
  const stocks: Array<TopicLimitStockItem> = [];
  const days: Array<string> = [];
  rows.forEach(r => {
    days.push(r.date);
    const industryItem = r.items.filter(v => v.topic === topic);
    const temp = industryItem.map(v => v.limit_stocks.map(s => ({ date: r.date, ...s }))).reduce((p, c) => p.concat(...c), []);
    stocks.push(...temp);
  });
  return { _tag: 'TopicLimitStocks', items: stocks, days };
};