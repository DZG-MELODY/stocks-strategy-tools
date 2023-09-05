import { httpPost } from '../../request';
import { API_TOKEN } from './config';

type BaseTuShareReq = {
  api_name: string
  token: string
}


type LimitListDayReq = BaseTuShareReq & {
  params: {
    trade_date?: string
    ts_code?: string
    limit_type?: string
    exchange?: string
    start_date?: string
    end_date?: string
  },
  fields: Array<string>
}

export interface BaseTuShareRes<T> {
  code: number
  data: T
  message: string
  request_id: string
}

export interface LimitListDayRes {
  fields: string[],
  has_more: boolean,
  items: Array<[string, string, string, string, number, number, number, number, number, number, number, string, string, number, string, number, string]>
}

export const fetchLimitHistoryForDay = (day: string) => httpPost<LimitListDayReq, BaseTuShareRes<LimitListDayRes>>('https://tushare.pro', {
  api_name: 'limit_list_d',
  token: API_TOKEN,
  params: {
    trade_date: day
  },
  fields: ["trade_date", "ts_code", "industry", "name", "close", "pct_chg", "amount", "float_mv", "total_mv", "turnover_ratio", "fd_amount", "first_time", "last_time", "open_times", "up_stat", "limit_times", "limit"]
});
