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


const covertStockItem = (item: StockItem): LimitForStock => ({
  _tag: 'LimitForStock',
  code: item.c,
  name: item.n,
  pct_chg: item.zdp,
  turnover_ratio: item.hs,
  has_fail: item.zbc > 0,
  limit_times: item.lbc,
  industry: item.hybk
});

export const fetchLimitHistoryForDay = async (day: string) => {
  const res = await httpGet<LimitListDayReq, LimitListDayRes>('http://push2ex.eastmoney.com/getTopicZTPool',
    {
      ut: UT,
      dpt: DPT,
      Pageindex: 0,
      pagesize: 1000,
      sort: 'fbt:asc',
      date: day,
    });
  if (res instanceof Error) return new Error(res.message);
  if (res.data === null) return new Error('当日无数据');
  return (res.data?.pool || []).map(v => covertStockItem(v));
};