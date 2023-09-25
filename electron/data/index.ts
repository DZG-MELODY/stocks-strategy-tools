import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { fetchLimitHistoryForDay } from './data-fetch/df-share';
import { fetchLimitHistoryForTopic } from './data-fetch/local-share/getLimitForTopic';
import {
  calcIndustryTrendForTimeline,
  getIndustryTrendForDay,
  getIndustryTrendForRange,
  updateIndustryTrendForDay,
  getLimitStocksForIndustry,
  getLimitHistoryForDay,
  updateLimitHistoryForDay,
  updateTopicTrendForDay,
  getTopicTrendForRange,
  calcTopicTrendForTimeline,
  getLimitStocksForTopic,
  updateTopicForLimitStocksByDay,
  type IndustryTrend,
  type TopicTrend,
  type TopicLimitStocks,
  type LimitForDay,
  type IndustryLimitStocks
} from './data-storage/low-db';
import { StockOfDaily, fetchStockDailyData } from './data-fetch/tu-share';

export type * from './data-storage/low-db';
export type * from './data-fetch/tu-share';


type DataResult<T extends { _tag: string }, E = string> = [true, T] | [false, E]


function wrapResult<T extends { _tag: string }, E = string>(ret: { success: true, result: T } | { success: false, result: E }): DataResult<T, E> {
  return ret.success === true ? [true, ret.result] : [false, ret.result];
}


export async function getLimitHistory(query: { day: string }): Promise<DataResult<LimitForDay>> {
  const { day } = query;
  const rows = await getLimitHistoryForDay(day);
  if (rows instanceof Error) return [false, rows.message];
  return [true, rows];
}


export async function getIndustryTrend(query: { start: string, end: string }): Promise<DataResult<IndustryTrend>> {
  const { start, end } = query;
  const rows = await getIndustryTrendForRange(start, end);
  if (rows instanceof Error) return [false, rows.message];
  const trends = calcIndustryTrendForTimeline(rows);
  return wrapResult<IndustryTrend>({ success: true, result: trends });
}



export async function getIndustryLimitStocks(query: { industry: string, start: string, end: string }): Promise<DataResult<IndustryLimitStocks>> {
  const { industry, start, end } = query;
  const ret = await getLimitStocksForIndustry(industry, start, end);
  if (ret instanceof Error) return [false, ret.message];
  return wrapResult<IndustryLimitStocks>({ success: true, result: ret });
}


export async function updateLimitForDay(query: { day: string }): Promise<DataResult<LimitForDay>> {
  try {
    const { day } = query;
    const limitRows = await getLimitHistoryForDay(day);
    const industryRows = await getIndustryTrendForDay(day);
    // 数据存在时直接返回
    if (limitRows instanceof Error) {
      // 请求数据
      const limitItems = await fetchLimitHistoryForDay(day);
      if (limitItems instanceof Error) return wrapResult<LimitForDay>({ success: false, result: limitItems.message });

      // 更新表
      await updateLimitHistoryForDay(day, limitItems);
      await updateIndustryTrendForDay(day, limitItems);
      return wrapResult<LimitForDay>({ success: true, result: { _tag: 'LimitForDay', date: day, items: limitItems } });
    }
    if (industryRows instanceof Error) return [true, limitRows];
    await updateIndustryTrendForDay(day, limitRows.items);
    return [true, limitRows];

  } catch (error) {
    return [false, error.message || '未知错误'];
  }
}


export async function getTopicTrend(query: { start: string, end: string }): Promise<DataResult<TopicTrend>> {
  const { start, end } = query;
  const rows = await getTopicTrendForRange(start, end);
  if (rows instanceof Error) return [false, rows.message];
  const trends = calcTopicTrendForTimeline(rows);
  return wrapResult<TopicTrend>({ success: true, result: trends });
}



export async function getTopicLimitStocks(query: { industry: string, start: string, end: string }): Promise<DataResult<TopicLimitStocks>> {
  const { industry, start, end } = query;
  const ret = await getLimitStocksForTopic(industry, start, end);
  if (ret instanceof Error) return [false, ret.message];
  return wrapResult<TopicLimitStocks>({ success: true, result: ret });
}


// 更新指定日期的题材数据
export async function updateTopicForDay(query: { day: string }): Promise<DataResult<LimitForDay>> {
  // 获取数据
  const limitRows = await fetchLimitHistoryForTopic();
  if (limitRows instanceof Error) return [false, limitRows.message];
  const { day } = query;
  // 更新涨停数据表
  let ret = await updateTopicForLimitStocksByDay(day, limitRows);
  if (ret instanceof Error) return [false, ret.message];
  // 更新题材趋势表
  ret = await updateTopicTrendForDay(day, limitRows);
  if (ret instanceof Error) return [false, ret.message];
  // 返回结果
  return wrapResult<LimitForDay>({ success: true, result: { _tag: 'LimitForDay', date: day, items: limitRows } });
}


// 获取指定股票的日线图
export async function getDailyDataForStock(query: { code: string, start: string, end: string }): Promise<DataResult<StockOfDaily>> {
  const { code, start, end } = query;
  const dailyData = await fetchStockDailyData(code, start, end);
  if (dailyData instanceof Error) return [false, dailyData.message];
  return wrapResult<StockOfDaily>({ success: true, result: dailyData });
}

const DataFetchMaps = {
  getLimitHistory,
  updateLimitForDay,
  getIndustryTrend,
  getIndustryLimitStocks,
  updateTopicForDay,
  getTopicTrend,
  getTopicLimitStocks,
  getDailyDataForStock
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

let HasInit = false;
export async function DataInit(type = 'low-db') {
  if (HasInit) return;
  if (type === 'low-db') {
    const { init } = await import('./data-storage/low-db/init');
    await init();
  }
  ipcMain.handle('data-fetch', (event, method, ...args): DataFetchHandleFn => DataFetchMaps[method](...args));
  HasInit = true;
}