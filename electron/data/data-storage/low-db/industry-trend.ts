import { LimitForStock } from './limit-history';
import { getTable } from './utils';

export type LimitForTrend = {
  _tag: 'LimitForTrend',
  // 行业板块
  industry: string,
  // 涨停个数
  limit_count: number,
  // 涨停股
  limit_stocks: Array<LimitForStock>
}

export type IndustryTrendForDay = {
  _tag: 'IndustryTrendForDay',
  // 日期
  date: string,
  // 行业趋势项
  items: Array<LimitForTrend>
}

const calcIndustryTrendForDay = (items: Array<LimitForStock>): Array<LimitForTrend> => {
  const industrySet = new Map<string, LimitForTrend>();
  items.forEach((v) => {
    if (!industrySet.has(v.industry)) industrySet.set(v.industry, { _tag: 'LimitForTrend', industry: v.industry, limit_count: 0, limit_stocks: [] });
    const item = industrySet.get(v.industry);
    item.limit_count += 1;
    item.limit_stocks.push(v);
  });
  return Array.from(industrySet.values());
};

export const setIndustryTrendForDay = async (date: string, items: Array<LimitForStock>) => {
  const table = await getTable('DB_INDUSTRY_TREND');
  if (table.data.name !== 'industry-trend') return;
  const row = table.data.rows.find(v => v.date === date);
  if (row) {
    row.items = calcIndustryTrendForDay(items);
  } else {
    table.data.rows.push({
      _tag: 'IndustryTrendForDay',
      date: date,
      items: calcIndustryTrendForDay(items)
    });
  }
  await table.write();
};

export const getIndustryTrendForDay = async (day: string) => {
  const table = await getTable('DB_INDUSTRY_TREND');
  if (table.data.name !== 'industry-trend') return false;
  const row = table.data.rows.find(v => v.date === day);
  return row ?? false;
};

export const getIndustryTrendForRange = async (start: string, end: string) => {
  const table = await getTable('DB_INDUSTRY_TREND');
  if (table.data.name !== 'industry-trend') return false;
  const rows = table.data.rows.filter(v => v.date >= start && v.date <= end).map(v => ({ ...v }));
  return rows;
};


export type IndustryTrendItem = {
  industry: string,
  trends: Array<{
    date: string,
    limit_count: number
  }>
}

export type IndustryTrend = {
  _tag: 'IndustryTrend',
  items: Array<IndustryTrendItem>
}


export const calcIndustryTrendForTimeline = (limitForRange: Array<IndustryTrendForDay>): IndustryTrend => {
  const industryMap = new Map<string, Array<{ date: string, limit_count: number }>>;
  const timeLen = limitForRange.length;
  // 占位记录
  const placeholderItems: Array<{ date: string, limit_count: number }> = [];
  for (let i = 0; i < timeLen; i++) {
    const { date, items } = limitForRange[i];
    placeholderItems.push({ date: date, limit_count: 0 });
    items.forEach(v => {
      if (industryMap.has(v.industry)) {
        industryMap.get(v.industry).push({ date: date, limit_count: v.limit_count });
      } else {
        industryMap.set(v.industry, [...placeholderItems]);
      }
      industryMap.forEach(item => {
        if (item.length === i) item.push({ date: date, limit_count: 0 });
      });
    });
  }
  return {
    _tag:'IndustryTrend',
    items: Array.from(industryMap.entries()).map(([industry,items])=>({industry,trends:items}))
  };
};