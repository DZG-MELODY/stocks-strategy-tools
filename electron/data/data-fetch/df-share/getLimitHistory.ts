import { type LimitForStock } from '../../data-storage/low-db';
import { httpGet } from '../../../utils/request';
import { DPT, UT } from './config';

type LimitListDayReq = {
  ut: string,
  dpt: string,
  Pageindex: number,
  pagesize: number,
  sort: 'fbt:asc' | 'fund:asc',
  date: string
}

type StockItem = {
  c: string,
  n: string,
  zdp: number,
  hs: number,
  lbc: number,
  zbc: number,
  hybk: string,
  zttj: {
    days: number,
    ct: number
  }
}

type LimitListDayRes = {
  data: null | {
    tc: number,
    pool: Array<StockItem>
  }
}

export const fetchLimitHistoryForDay = (day: string) => httpGet<LimitListDayReq, LimitListDayRes>('http://push2ex.eastmoney.com/getTopicZTPool',
  {
    ut: UT,
    dpt: DPT,
    Pageindex: 0,
    pagesize: 1000,
    sort: 'fbt:asc',
    date: day,
  }
);

export const covertStockItem = (item: StockItem): LimitForStock => ({
  code: item.c,
  name: item.n,
  pct_chg: item.zdp,
  turnover_ratio: item.hs,
  has_fail: item.zbc > 0,
  limit_times: item.lbc,
  industry: item.hybk
});