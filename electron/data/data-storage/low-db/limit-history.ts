import { getTable } from './utils';

export type LimitForStock = {
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
  industry: string
}

export type LimitForDay = {
  date: string,
  items: Array<LimitForStock>
}


export const setLimitHistoryForDay = async (date: string, items: Array<LimitForStock>) => {
  const table = await getTable('DB_LIMIT_HISTORY');
  const row = table.data.rows.find(v => v.date === date);
  if (row) {
    row.items = items;
  } else {
    table.data.rows.push({
      date: date,
      items: items
    });
  }
  await table.write();
};

export const getLimitHistoryForDay = async (day: string) => {
  const table = await getTable('DB_LIMIT_HISTORY');
  const row = table.data.rows.find(v => v.date === day);
  return row ?? false;
};