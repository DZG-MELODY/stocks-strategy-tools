import { readFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import { decode } from 'iconv-lite';

export async function fetchFromCSV<T extends Array<unknown>>(path: string): Promise<T | false> {
  try {
    const buffer = await readFile(path);
    const content = decode(buffer, 'GBK');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    });
    return records as T;
  } catch (error) {
    return false;
  }
} 