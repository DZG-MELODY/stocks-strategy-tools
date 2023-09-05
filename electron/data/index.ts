import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { HTTPResponseError } from '../utils/request';
import { fetchLimitHistoryForDay, covertStockItem } from './data-fetch/df-share';
import { getLimitHistoryForDay, setLimitHistoryForDay, type LimitForDay } from './data-storage/low-db';
import { init } from './data-storage/low-db/init';
export type * from './data-storage/low-db';


type DataResult<T, E = string> = [true, T] | [false, E]


function wrapResult<T, E = string>(ret: { success: true, result: T } | { success: false, result: E }): DataResult<T, E> {
  return ret.success === true ? [true, ret.result] : [false, ret.result];
}


export async function getLimitHistory(query: { day: string }): Promise<DataResult<LimitForDay>> {
  const { day } = query;
  const rows = await getLimitHistoryForDay(day);
  if (rows !== false) return [true, rows];
  const res = await fetchLimitHistoryForDay(day);
  if (res instanceof HTTPResponseError) {
    return wrapResult<LimitForDay>({ success: false, result: res.message });
  } else if (res.data !== null) {
    const rows = (res.data?.pool || []).map(v => covertStockItem(v));
    await setLimitHistoryForDay(day, rows);
    return wrapResult<LimitForDay>({ success: true, result: { date: day, items: rows } });
  }
  return wrapResult<LimitForDay>({ success: false, result: 'unknown error' });
}

export async function getTestData(seed: number): Promise<DataResult<Array<number>>> {
  return wrapResult<Array<number>>({
    success: true,
    result: Array(seed).fill(1).map((v, i) => i + v)
  });
}

const DataFetchMaps = {
  limitHistory: getLimitHistory,
  testData: getTestData
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