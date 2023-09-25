import { httpPost } from '../../../utils/request';
import { API_TOKEN } from './config';
import type { BaseTuShareReq, BaseTuShareRes } from './config';

type StockForDayReq = BaseTuShareReq & {
  params: {
    ts_code: string
    trade_date?: string
    start_date?: string
    end_date?: string
  },
  fields: Array<string>
}

export interface StockForDayRes {
  fields: string[],
  has_more: boolean,
  items: Array<[string, string, number, number, number, number, number, number, number, number, number]>
}

export type StockOfDailyItem = {
  ts_code: string
  trade_date: string
  open: number
  high: number
  low: number
  close: number
  pre_close: number
  change: number
  pct_chg: number
  vol: number
  amount: number
}

export type StockOfDaily = {
  _tag: 'StockOfDaily',
  items: Array<StockOfDailyItem>
}


const fixStockCode = (stockCode: string): string => {
  if (/^(60)\d{4}$/.test(stockCode)) {
    return `${stockCode}.SH`;
  } else if (/^(00|30)\d{4}$/.test(stockCode)) {
    return `${stockCode}.SZ`;
  } else {
    return stockCode;
  }
};

export const fetchStockDailyData = async (stockCode: string | string[], start: string, end: string): Promise<Error | StockOfDaily> => {
  const ret = await httpPost<StockForDayReq, BaseTuShareRes<StockForDayRes>>('http://api.tushare.pro', {
    api_name: 'daily',
    token: API_TOKEN,
    params: {
      ts_code: Array.isArray(stockCode) ? stockCode.map(v => fixStockCode(v)).join(',') : fixStockCode(stockCode),
      start_date: start,
      end_date: end
    },
    fields: [
      "ts_code",
      "trade_date",
      "open",
      "high",
      "low",
      "close",
      "pre_close",
      "change",
      "pct_chg",
      "vol",
      "amount"
    ]
  });
  if (ret instanceof Error) return new Error(ret.message);
  if (ret.code !== 0) return new Error(ret.msg);
  return {
    _tag: 'StockOfDaily',
    items: ret.data.items.map(([ts_code, trade_date, open, high, low, close, pre_close, change, pct_chg, vol, amount]) => ({
      ts_code,
      trade_date,
      open,
      high,
      low,
      close,
      pre_close,
      change,
      pct_chg,
      vol,
      amount
    }))
  };
};