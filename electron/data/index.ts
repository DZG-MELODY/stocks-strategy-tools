import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { fetchLimitHistoryForDay } from './data-fetch/df-share';
import { fetchLimitHistoryForTopic } from './data-fetch/local-share/getLimitForTopic';
import {
  IndustryTrend,
  calcIndustryTrendForTimeline,
  getIndustryTrendForDay,
  getIndustryTrendForRange,
  setIndustryTrendForDay,
  getLimitStocksForIndustry,
  getLimitHistoryForDay,
  setLimitHistoryForDay,
  setTopicTrendForDay,
  TopicTrend,
  getTopicTrendForRange,
  TopicLimitStocks,
  calcTopicTrendForTimeline,
  getLimitStocksForTopic,
  type LimitForDay,
  type IndustryLimitStocks
} from './data-storage/low-db';

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
  const { start, end } = query;
  const rows = await getIndustryTrendForRange(start, end);
  if (rows === false) return [false, '未生成数据'];
  const trends = calcIndustryTrendForTimeline(rows);
  return wrapResult<IndustryTrend>({ success: true, result: trends });
}



export async function getIndustryLimitStocks(query: { industry: string, start: string, end: string }): Promise<DataResult<IndustryLimitStocks>> {
  const { industry, start, end } = query;
  const ret = await getLimitStocksForIndustry(industry, start, end);
  if (ret === false) return [false, '未生成数据'];
  return wrapResult<IndustryLimitStocks>({ success: true, result: ret });
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
    const limitItems = await fetchLimitHistoryForDay(day);
    if (limitItems instanceof Error) return wrapResult<LimitForDay>({ success: false, result: limitItems.message });

    // 更新表
    await setLimitHistoryForDay(day, limitItems);
    await setIndustryTrendForDay(day, limitItems);
    return wrapResult<LimitForDay>({ success: true, result: { _tag: 'LimitForDay', date: day, items: limitItems } });
  } catch (error) {
    return [false, error.message || '未知错误'];
  }
}


export async function getTopicTrend(query: { start: string, end: string }): Promise<DataResult<TopicTrend>> {
  const { start, end } = query;
  const rows = await getTopicTrendForRange(start, end);
  if (rows === false) return [false, '未生成数据'];
  const trends = calcTopicTrendForTimeline(rows);
  return wrapResult<TopicTrend>({ success: true, result: trends });
}



export async function getTopicLimitStocks(query: { industry: string, start: string, end: string }): Promise<DataResult<TopicLimitStocks>> {
  const { industry, start, end } = query;
  const ret = await getLimitStocksForTopic(industry, start, end);
  if (ret === false) return [false, '未生成数据'];
  return wrapResult<TopicLimitStocks>({ success: true, result: ret });
}


// 更新指定日期的题材数据
export async function updateTopicForDay(query: { day: string }): Promise<DataResult<LimitForDay>> {
  try {
    const limitRows = await fetchLimitHistoryForTopic();
    if (limitRows instanceof Error) return [false, limitRows.message];
    const { day } = query;
    // 更新表
    await setTopicTrendForDay(day, limitRows);
    return wrapResult<LimitForDay>({ success: true, result: { _tag: 'LimitForDay', date: day, items: limitRows } });

  } catch (error) {
    return [false, error.message || '未知错误'];
  }
}


const DataFetchMaps = {
  limitHistory: getLimitHistory,
  updateLimitForDay,
  getIndustryTrend,
  getIndustryLimitStocks,
  updateTopicForDay,
  getTopicTrend,
  getTopicLimitStocks
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
    const { init } = await import('./data-storage/low-db/init');
    await init();
  }
  ipcMain.handle('data-fetch', (event, method, ...args): DataFetchHandleFn => DataFetchMaps[method](...args));
}