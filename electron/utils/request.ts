import Fetch, { Response } from 'node-fetch';
import { URL, URLSearchParams } from 'node:url';

let fetch: typeof Fetch | null = null;

export class HTTPResponseError extends Error {
  constructor(response: Response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
  }
}

async function createFetch() {
  if (fetch !== null) return fetch;
  const res = await import('node-fetch');
  fetch = res.default;
  return fetch;
}

export async function httpGet<Req, Res>(url: string, params?: Req, options?: { headers?: Record<string, string> }) {
  const urlObj = new URL(url);
  urlObj.search = new URLSearchParams(Object.fromEntries(Object.entries(params || {}))).toString();
  try {
    const fetch = await createFetch();
    const ret = await fetch(urlObj.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (ret.ok) return (await ret.json()) as Res;
    return new HTTPResponseError(ret);
  } catch (error) {
    const errorBody = await error.response.text();
    return new Error(errorBody);
  }

};

export async function httpPost<Req, Res>(url: string, params: Req, options?: { headers?: Record<string, string> }) {
  try {
    const fetch = await createFetch();
    const ret = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (ret.ok) return (await ret.json()) as Res;
    return new HTTPResponseError(ret);
  } catch (error) {
    const errorBody = await error.response.text();
    return new Error(errorBody);
  }
};