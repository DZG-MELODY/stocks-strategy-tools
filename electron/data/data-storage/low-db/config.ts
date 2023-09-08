import { cwd } from 'node:process';
import { join } from 'node:path';
import { type Low } from 'lowdb';
import { type LimitForDay } from './limit-history';
import { IndustryTrendForDay } from './industry-trend';

export const DB_ROOT = process.env.NODE_ENV === 'development' ? join(cwd(), 'db', 'low-db') : join(__dirname, '..', 'low-db');

export const DB_TABLES_CONFIGS = {
  DB_LIMIT_HISTORY: {
    path: join(DB_ROOT, 'limit-history.json'),
    default: (): { name: 'limit-history', rows: Array<LimitForDay> } => ({ name: 'limit-history', rows: [] }),
  },
  DB_INDUSTRY_TREND: {
    path: join(DB_ROOT, 'industry-trend.json'),
    default: (): { name: 'industry-trend', rows: Array<IndustryTrendForDay> } => ({ name: 'industry-trend', rows: [] })
  }
};

export const DB_TABLES = new Map<DbTableNames, DbTableInstances>();


export type DbTableNames = keyof typeof DB_TABLES_CONFIGS;
export type DbTableConfig = { path: string, default: () => object };
export type DbTableInstances = { table: Low };
export type DbTablesMeta = { [key in DbTableNames]: ReturnType<(typeof DB_TABLES_CONFIGS)[key]["default"]> };

