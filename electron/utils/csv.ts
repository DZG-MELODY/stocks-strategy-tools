import { readFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

export async function fetchFromCSV<T extends Array<unknown>>(path: string): Promise<T | false> {
  try {
    const content = await readFile(path, { encoding: 'utf-8' });
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    });
    return records as T;
  } catch (error) {
    return false;
  }

} 