import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { type Low } from 'lowdb';
// import { JSONFile } from 'lowdb/node';
import { type LimitForDay } from './limit-history';

const DB_ROOT = join(__dirname, '..', 'low-db');

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

export const init = async () => {
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');
  if (!existsSync(DB_ROOT)) mkdirSync(DB_ROOT);
  Object.entries(DB_TABLES_CONFIGS).forEach(([name, config]) => {
    DB_TABLES.set(name as DbTableNames, {
      table: new Low(new JSONFile(config.path), config.default())
    });
  });
};