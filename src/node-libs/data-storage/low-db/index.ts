import { type Low } from "lowdb";
import { DB_TABLES, DbTableNames, DbTablesMeta } from "./init";


async function getTable<T extends DbTableNames>(name: DbTableNames) {
  const table = DB_TABLES.get(name).table as Low<DbTablesMeta[T]>;
  await table.read();
  return table;
}


export const setLimitHistory = async (date: string, items: Array<Array<string | number>>) => {
  const table = await getTable('DB_LIMIT_HISTORY');
  const row = table.data.rows.find(v => v.date === date);
  if (row) {
    row.items = items;
  } else {
    table.data.rows.push({
      date: date,
      items: items
    });
  }
  await table.write();
};

export const getLimitHistory = async () => {
  const table = await getTable('DB_LIMIT_HISTORY');
  const row = table.data.rows.find(v => v.date === '20230102');
  return row;
};
