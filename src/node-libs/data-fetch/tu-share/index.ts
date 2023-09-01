import { httpPost } from '../../request';

const API_TOKEN = "d352f476615808a29cf083723c00f79446dcb1d2895f133c780206af";

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

export const fetchLimitHistoryForDayBak = (day: string) => httpPost<LimitListDayReq, BaseTuShareRes<LimitListDayRes>>('https://tushare.pro', {
  api_name: 'limit_list_d',
  token: API_TOKEN,
  params: {
    trade_date: day
  },
  fields: ["trade_date", "ts_code", "industry", "name", "close", "pct_chg", "amount", "float_mv", "total_mv", "turnover_ratio", "fd_amount", "first_time", "last_time", "open_times", "up_stat", "limit_times", "limit"]
});

export const fetchLimitHistoryForDay = (day: string) => httpPost<unknown, BaseTuShareRes<LimitListDayRes>>('https://tushare.pro', {
  "user_id": 609689,
  "username": "DZG_MELODY",
  "user_valid": true,
  "root_id": "2",
  "doc_id": "298",
  "params": {
    "trade_date": day,
    "ts_code": "",
    "limit_type": "U",
    "exchange": "",
    "start_date": "",
    "end_date": "",
    "limit": "",
    "offset": ""
  },
  "fields": [
    "trade_date",
    "ts_code",
    "industry",
    "name",
    "close",
    "pct_chg",
    "amount",
    "limit_amount",
    "float_mv",
    "total_mv",
    "turnover_ratio",
    "fd_amount",
    "first_time",
    "last_time",
    "open_times",
    "up_stat",
    "limit_times",
    "limit"
  ]
});

export const clientConfig = {
  "user_id": 609689,
  "username": "DZG_MELODY",
  "user_valid": true,
  "root_id": "2",
  "doc_id": "298",
  "params": {
    "trade_date": "20230901",
    "ts_code": "",
    "limit_type": "U",
    "exchange": "",
    "start_date": "",
    "end_date": "",
    "limit": "",
    "offset": ""
  },
  "fields": [
    "trade_date",
    "ts_code",
    "industry",
    "name",
    "close",
    "pct_chg",
    "amount",
    "limit_amount",
    "float_mv",
    "total_mv",
    "turnover_ratio",
    "fd_amount",
    "first_time",
    "last_time",
    "open_times",
    "up_stat",
    "limit_times",
    "limit"
  ]
};