import { httpPost } from '../../request';

const API_TOKEN = "" ;

interface BaseTuShareReq {
  token:string
}

export const fetchLimitHistoryForDay = (day:number)=>httpPost<>('',{});