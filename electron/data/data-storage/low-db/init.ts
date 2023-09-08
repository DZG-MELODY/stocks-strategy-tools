import { existsSync, mkdirSync } from 'node:fs';
import { DB_ROOT, DB_TABLES_CONFIGS, DB_TABLES, DbTableNames } from "./config";



export const init = async () => {
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');
  if (!existsSync(DB_ROOT)) mkdirSync(DB_ROOT, { recursive: true });
  Object.entries(DB_TABLES_CONFIGS).forEach(([name, config]) => {
    DB_TABLES.set(name as DbTableNames, {
      table: new Low(new JSONFile(config.path), config.default())
    });
  });
};