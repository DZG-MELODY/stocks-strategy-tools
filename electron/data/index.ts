import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { HTTPResponseError } from '../utils/request';
import { fetchLimitHistoryForDay, covertStockItem } from './data-fetch/df-share';
import { getLimitHistoryForDay, setLimitHistoryForDay, type LimitForDay } from './data-storage/low-db';
import { init } from './data-storage/low-db/init';
import { IndustryTrend, calcIndustryTrendForTimeline, getIndustryTrendForDay, getIndustryTrendForRange, setIndustryTrendForDay } from './data-storage/low-db/industry-trend';
export type * from './data-storage/low-db';


type DataResult<T extends { _tag: string }, E = string> = [true, T] | [false, E]


function wrapResult<T extends { _tag: string }, E = string>(ret: { success: true, result: T } | { success: false, result: E }): DataResult<T, E> {
  return ret.success === true ? [true, ret.result] : [false, ret.result];
}


export async function getLimitHistory(query: { day: string }): Promise<DataResult<LimitForDay>> {
  const { day } = query;
  const rows = await getLimitHistoryForDay(day);
  if (rows === false) return [false, '数据不存在'];
  return [true, rows];
}


export async function getIndustryTrend(query: { start: string, end: string }): Promise<DataResult<IndustryTrend>> {
   const {start,end} = query;
   const rows = await getIndustryTrendForRange(start,end);
   if(rows === false) return [false,'未生成数据'];
   const trends = calcIndustryTrendForTimeline(rows);
   return wrapResult<IndustryTrend>({success:true,result:trends});
}


export async function updateLimitForDay(query: { day: string }): Promise<DataResult<LimitForDay>> {
  try {
    const { day } = query;
    const limitRows = await getLimitHistoryForDay(day);
    const industryRows = await getIndustryTrendForDay(day);
    // 数据存在时直接返回
    if (limitRows !== false) {
      if (industryRows === false) await setIndustryTrendForDay(day, limitRows.items);
      return [true, limitRows];
    }
    // 请求数据
    const res = await fetchLimitHistoryForDay(day);
    if (res instanceof HTTPResponseError) return wrapResult<LimitForDay>({ success: false, result: res.message });
    if (res.data === null) return [false, '当日无数据'];
    const limitItems = (res.data?.pool || []).map(v => covertStockItem(v));
    // 更新表
    await setLimitHistoryForDay(day, limitItems);
    await setIndustryTrendForDay(day, limitItems);
    return wrapResult<LimitForDay>({ success: true, result: { _tag: 'LimitForDay', date: day, items: limitItems } });
  } catch (error) {
    return [false, error.message || '未知错误'];
  }
}


const DataFetchMaps = {
  updateLimitForDay: updateLimitForDay,
  limitHistory: getLimitHistory,
  getIndustryTrend:getIndustryTrend
};

export type DataFetchMaps = typeof DataFetchMaps

export type DataFetchParamsMaps = {
  [key in keyof DataFetchMaps]: Parameters<DataFetchMaps[key]>
}

export type DataFetchReturnMaps = {
  [key in keyof DataFetchMaps]: ReturnType<DataFetchMaps[key]>
}


export type DataFetchInvokeFn = (
  method: keyof DataFetchMaps,
  ...args: DataFetchParamsMaps[typeof method]
) => DataFetchReturnMaps[typeof method]

export type DataFetchHandleFn = (
  event: IpcMainInvokeEvent,
  method: keyof DataFetchMaps,
  ...args: DataFetchParamsMaps[typeof method]
) => DataFetchReturnMaps[typeof method]


export async function DataInit(type = 'low-db') {
  if (type === 'low-db') {
    await init();
  }
  ipcMain.handle('data-fetch', (event, method, ...args): DataFetchHandleFn => DataFetchMaps[method](...args));
}