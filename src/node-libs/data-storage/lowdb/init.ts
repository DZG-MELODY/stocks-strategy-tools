import {join} from 'node:path';
import { cwd } from 'node:process';

const DB_ROOT = join(cwd(),'./db');
const DB_LIMIT_HISTORY = join(DB_ROOT,'limit-history.json');