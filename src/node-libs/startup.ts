import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';
import { init } from './data-storage/low-db/init';

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args);
  init();
});

lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats);
  console.log(process.env.VITE_PUBLIC);
}).catch(err => {
  console.error(err);
});
