import fetch,{Response} from 'node-fetch';
import {URL,URLSearchParams} from 'node:url';

class HTTPResponseError extends Error {
	constructor(response:Response) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`);
	}
}

export async function httpGet<Req,Res>(url:string,params?:Req){
  const urlObj = new URL(url);
  urlObj.search = new URLSearchParams(Object.fromEntries(Object.entries(params||{}))).toString();
  try {
    const ret = await fetch(url.toString(),{
      method:'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(ret.ok) return (await ret.json()) as Res;
    return new HTTPResponseError(ret);
  } catch (error) {
    const errorBody = await error.response.text();
    return new Error(errorBody);
  }

};

export async function httpPost<Req,Res>(url:string,params:Req){
  try {
    const ret = await fetch(url,{
      method:'POST',
      body:JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(ret.ok) return (await ret.json()) as Res;
    return new HTTPResponseError(ret);
  } catch (error) {
    const errorBody = await error.response.text();
    return new Error(errorBody);
  }
};