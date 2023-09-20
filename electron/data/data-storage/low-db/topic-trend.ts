import { LimitForStock } from './limit-history';
import { getTable } from './utils';


export type LimitForTopic = {
  _tag: 'LimitForTopic',
  // 行业板块
  topic: string,
  // 涨停个数
  limit_count: number,
  // 涨停股
  limit_stocks: Array<LimitForStock>
}

export type TopicTrendForDay = {
  _tag: 'TopicTrendForDay',
  // 日期
  date: string,
  // 行业趋势项
  items: Array<LimitForTopic>
}


const calcTopicTrendForDay = (items: Array<LimitForStock>, type: 'tdx' | 'ths' = 'tdx'): Array<LimitForTopic> => {
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



export const updateTopicTrendForDay = async (date: string, items: Array<LimitForStock>) => {
  const table = await getTable('DB_TOPIC_TREND');
  if (table.data.name !== 'topic-trend') return new Error('数据库表不匹配');
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
  try {
    await table.write();
    return true;
  } catch (error) {
    return new Error('表写入错误');
  }
};

export const getTopicTrendForRange = async (start: string, end: string) => {
  const table = await getTable('DB_TOPIC_TREND');
  if (table.data.name !== 'topic-trend') return new Error('数据库表不匹配');
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


export type TopicLimitStockItem = LimitForStock & { date: string }
export type TopicLimitStocks = { _tag: 'TopicLimitStocks', items: Array<TopicLimitStockItem>, days: Array<string> }

export const getLimitStocksForTopic = async (topic: string, start: string, end: string): Promise<TopicLimitStocks | Error> => {
  const rows = await getTopicTrendForRange(start, end);
  if (rows instanceof Error) return rows;
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