// 通过csv文件读取
import { selectFileByDialog } from '../../../utils/files';
import { LimitForStock } from 'electron/data';
import { fetchFromCSV } from '../../../utils/csv';

type StockItem = {
  '股票代码': string,
  '股票名称': string,
  '连板': string,
  '涨幅%': string,
  '换手率%': string,
  '开板': string,
  '涨停原因': string
}

const covertStockItem = (item: StockItem): LimitForStock => ({
  _tag: 'LimitForStock',
  code: item['股票代码'],
  name: item['股票名称'],
  pct_chg: Number(item['涨幅%']),
  turnover_ratio: Number(item['换手率%']),
  has_fail: Number(item['开板']) > 0,
  limit_times: Number(item['连板']),
  industry: '',
  tdx_topics: item['涨停原因'].split('+').length > 1 ? [...item['涨停原因'].split('+')] : [item['涨停原因']],
  ths_topics: []
});

export const fetchLimitHistoryForTopicByLocal = async () => {
  const selectFile = await selectFileByDialog();
  if (selectFile === false) return new Error('未选择文件');
  const ret = await fetchFromCSV<Array<StockItem>>(selectFile[0]);
  if (ret === false) return new Error('文件解析错误');
  return ret.map(v => covertStockItem(v));
};