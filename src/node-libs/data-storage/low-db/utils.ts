import { type Low } from "lowdb";
import { DB_TABLES, DbTableNames, DbTablesMeta } from "./init";


export async function getTable<T extends DbTableNames>(name: DbTableNames) {
  const table = DB_TABLES.get(name).table as Low<DbTablesMeta[T]>;
  await table.read();
  return table;
}


