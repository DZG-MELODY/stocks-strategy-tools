import { getTable } from './utils';

export type LimitForStock = {
  _tag: 'LimitForStock',
  // 代码
  code: string,
  // 名称
  name: string,
  // 涨跌幅
  pct_chg: number,
  // 换手率
  turnover_ratio: number,
  // 是否炸板
  has_fail: boolean,
  // 连板数
  limit_times: number,
  // 行业板块
  industry: string,
  // 通达信题材
  tdx_topics: Array<string>,
  // 同花顺题材
  ths_topics: Array<string>
}

export type LimitForDay = {
  _tag: 'LimitForDay',
  date: string,
  items: Array<LimitForStock>
}


export const updateLimitHistoryForDay = async (date: string, items: Array<LimitForStock>) => {
  const table = await getTable('DB_LIMIT_HISTORY');
  if (table.data.name !== 'limit-history') return new Error('数据库表不匹配');
  const row = table.data.rows.find(v => v.date === date);
  if (row) {
    row.items = items;
  } else {
    table.data.rows.push({
      _tag: 'LimitForDay',
      date: date,
      items: items
    });
  }
  try {
    await table.write();
    return true;
  } catch (error) {
    return new Error('表写入错误');
  }
};

export const updateTopicForLimitStocksByDay = async (date: string, items: Array<LimitForStock>, type: 'tdx' | 'ths' = 'tdx') => {
  const table = await getTable('DB_LIMIT_HISTORY');
  if (table.data.name !== 'limit-history') return new Error('数据库表不匹配');
  const orgStocks = table.data.rows.find(r => r.date === date);
  if (!orgStocks) return new Error('未找指定日期的数据');
  orgStocks.items.forEach(s => {
    const target = items.find(v => v.name === s.name);
    if (type === 'tdx') {
      if (Array.isArray(s.tdx_topics)) s.tdx_topics = [];
      if (s.tdx_topics.length === 0) s.tdx_topics.push(...target.tdx_topics);
    } else {
      if (Array.isArray(s.ths_topics)) s.ths_topics = [];
      if (s.ths_topics.length === 0) s.ths_topics.push(...target.ths_topics);
    }
  });
  try {
    await table.write();
    return true;
  } catch (error) {
    return new Error('表写入错误');
  }
};

export const getLimitHistoryForDay = async (day: string) => {
  const table = await getTable('DB_LIMIT_HISTORY');
  if (table.data.name !== 'limit-history') return new Error('数据库表不匹配');
  const row = table.data.rows.find(v => v.date === day);
  if (!row) return new Error('未找指定日期的数据');
  return row;
};