import { httpGet } from '../../../utils/request';
import { LimitForStock } from 'electron/data';

export type XGBResponse<T> = {
  code: number,
  message: string,
  data: T
}

export type XGBStockItem = {
  "break_limit_down_times": number,
  "break_limit_up_times": number,
  "buy_lock_volume_ratio": number,
  "change_percent": number,
  "first_break_limit_down": number,
  "first_break_limit_up": number,
  "first_limit_down": number,
  "first_limit_up": number,
  "is_new_stock": boolean,
  "issue_price": number,
  "last_break_limit_down": number,
  "last_break_limit_up": number,
  "last_limit_down": number,
  "last_limit_up": number,
  "limit_down_days": number,
  "limit_timeline": {
    "items": Array<{
      "timestamp": number,
      "status": number
    }>
  },
  "limit_up_days": number,
  "listed_date": number,
  "m_days_n_boards_boards": number,
  "m_days_n_boards_days": number,
  "mtm": number,
  "nearly_new_acc_pcp": number,
  "nearly_new_break_days": number,
  "new_stock_acc_pcp": number,
  "new_stock_break_limit_up": number,
  "new_stock_limit_up_days": number,
  "new_stock_limit_up_price_before_broken": number,
  "non_restricted_capital": number,
  "price": number,
  "sell_lock_volume_ratio": number,
  "stock_chi_name": string,
  "stock_type": number,
  "surge_reason": {
    "symbol": string,
    "stock_reason": string,
    "related_plates": Array<{
      "plate_id": number,
      "plate_name": string,
      "plate_reason": string
    }>
  },
  "symbol": string,
  "total_capital": number,
  "turnover_ratio": number,
  "volume_bias_ratio": number,
  "yesterday_break_limit_up_times": number,
  "yesterday_first_limit_up": number,
  "yesterday_last_limit_up": number,
  "yesterday_limit_down_days": number,
  "yesterday_limit_up_days": number
}

export const fetchLimitStocksByDayForXGB = async (day: string) => {
  const ret = await httpGet<{ pool_name: string, date: string }, XGBResponse<Array<XGBStockItem>>>(
    "https://flash-api.xuangubao.cn/api/pool/detail",
    {
      pool_name: 'limit_up',
      date: day
    }
  );
  if (ret instanceof Error) return new Error(ret.message);
  if (ret.code !== 20000) return new Error(ret.message);
  // 排除新股和st股
  return ret.data.filter(s => s.is_new_stock === false && s.stock_chi_name.includes('ST') === false);
};

const covertStockItem = (item: XGBStockItem): LimitForStock => ({
  _tag: 'LimitForStock',
  code: item.symbol.split('.')[0],
  name: item.stock_chi_name,
  pct_chg: item.change_percent * 100,
  turnover_ratio: item.turnover_ratio * 100,
  has_fail: item.break_limit_up_times > 0,
  limit_times: item.limit_up_days,
  industry: '',
  tdx_topics: item.surge_reason.related_plates.map(p => p.plate_name),
  ths_topics: []
});

export const fetchLimitHistoryForTopicByXGB = async (day: string) => {
  const [y1, y2, y3, y4, m1, m2, d1, d2] = day.split('');
  const ret = await fetchLimitStocksByDayForXGB(`${y1}${y2}${y3}${y4}-${m1}${m2}-${d1}${d2}`);
  if (ret instanceof Error) return ret;
  return ret.map(v => covertStockItem(v));
};