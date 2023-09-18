import { dialog } from 'electron';

export const selectFileByDialog = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ title: '选择数据文件', filters: [{ name: 'CSV文件', extensions: ['csv'] }] });
  return canceled ? false : filePaths;
};