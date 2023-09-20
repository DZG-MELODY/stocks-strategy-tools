import { LimitForStock } from './limit-history';
import { getTable } from './utils';

export type LimitForIndustry = {
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
  items: Array<LimitForIndustry>
}

const calcIndustryTrendForDay = (items: Array<LimitForStock>): Array<LimitForIndustry> => {
  const industrySet = new Map<string, LimitForIndustry>();
  items.forEach((v) => {
    if (!industrySet.has(v.industry)) industrySet.set(v.industry, { _tag: 'LimitForTrend', industry: v.industry, limit_count: 0, limit_stocks: [] });
    const item = industrySet.get(v.industry);
    item.limit_count += 1;
    item.limit_stocks.push(v);
  });
  return Array.from(industrySet.values());
};

export const updateIndustryTrendForDay = async (date: string, items: Array<LimitForStock>) => {
  const table = await getTable('DB_INDUSTRY_TREND');
  if (table.data.name !== 'industry-trend') return new Error('数据库表不匹配');
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
  try {
    await table.write();
    return true;
  } catch (error) {
    return new Error('表写入错误');
  }
};

export const getIndustryTrendForDay = async (day: string) => {
  const table = await getTable('DB_INDUSTRY_TREND');
  if (table.data.name !== 'industry-trend') return new Error('数据库表不匹配');
  const row = table.data.rows.find(v => v.date === day);
  if (!row) return new Error('未找指定日期的数据');
  return row;
};

export const getIndustryTrendForRange = async (start: string, end: string) => {
  const table = await getTable('DB_INDUSTRY_TREND');
  if (table.data.name !== 'industry-trend') return new Error('数据库表不匹配');
  const rows = table.data.rows.filter(v => v.date >= start && v.date <= end).map(v => ({ ...v })).sort((v1, v2) => v1.date > v2.date ? 1 : -1);
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

// 计算行业趋势时间线
export const calcIndustryTrendForTimeline = (limitForRange: Array<IndustryTrendForDay>): IndustryTrend => {
  const industryMap = new Map<string, Array<{ date: string, limit_count: number }>>;
  const timeLen = limitForRange.length;
  // 占位记录
  const placeholderItems: Array<{ date: string, limit_count: number }> = [];
  for (let i = 0; i < timeLen; i++) {
    const { date, items } = limitForRange[i];
    items.forEach(v => {
      if (industryMap.has(v.industry)) {
        industryMap.get(v.industry).push({ date: date, limit_count: v.limit_count });
      } else {
        //补充前零值
        industryMap.set(v.industry, [...placeholderItems, { date: date, limit_count: v.limit_count }]);
      }
    });
    // 补充后零值
    industryMap.forEach(item => {
      if (item.length === i) item.push({ date: date, limit_count: 0 });
    });
    placeholderItems.push({ date: date, limit_count: 0 });
  }
  return {
    _tag: 'IndustryTrend',
    items: Array.from(industryMap.entries()).map(([industry, items]) => ({ industry, trends: items }))
  };
};



export type IndustryLimitStockItem = LimitForStock & { date: string }
export type IndustryLimitStocks = { _tag: 'IndustryLimitStocks', items: Array<IndustryLimitStockItem>, days: Array<string> }

export const getLimitStocksForIndustry = async (industry: string, start: string, end: string): Promise<IndustryLimitStocks | Error> => {
  const rows = await getIndustryTrendForRange(start, end);
  if (rows instanceof Error) return rows;
  const stocks: Array<IndustryLimitStockItem> = [];
  const days: Array<string> = [];
  rows.forEach(r => {
    days.push(r.date);
    const industryItem = r.items.filter(v => v.industry === industry);
    const temp = industryItem.map(v => v.limit_stocks.map(s => ({ date: r.date, ...s }))).reduce((p, c) => p.concat(...c), []);
    stocks.push(...temp);
  });
  return { _tag: 'IndustryLimitStocks', items: stocks, days };
};