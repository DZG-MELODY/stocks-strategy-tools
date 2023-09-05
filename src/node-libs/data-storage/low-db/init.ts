import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { type LimitForDay } from './limit-history';

console.log(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const DB_ROOT = join(__dirname, 'db');

console.log(DB_ROOT);

const DB_TABLES_CONFIGS = {
  DB_LIMIT_HISTORY: {
    path: join(DB_ROOT, 'limit-history.json'),
    default: (): { name: 'limit-history', rows: Array<LimitForDay> } => ({ name: 'limit-history', rows: [] }),
  }
};


export type DbTableNames = keyof typeof DB_TABLES_CONFIGS;
export type DbTableConfig = { path: string, default: () => object };
export type DbTableInstances = { table: Low };
export type DbTablesMeta = {
  [key in DbTableNames]: ReturnType<(typeof DB_TABLES_CONFIGS)[key]["default"]>
}

export const DB_TABLES = new Map<DbTableNames, DbTableInstances>();

export const init = () => {
  if (!existsSync(DB_ROOT)) mkdirSync(DB_ROOT);
  Object.entries(DB_TABLES_CONFIGS).forEach(([name, config]) => {
    DB_TABLES.set(name as DbTableNames, {
      table: new Low(new JSONFile(config.path), config.default())
    });
  });
};