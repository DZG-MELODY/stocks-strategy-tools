export const API_TOKEN = "d352f476615808a29cf083723c00f79446dcb1d2895f133c780206af";



export type BaseTuShareReq = {
  api_name: string
  token: string
}



export interface BaseTuShareRes<T> {
  code: number
  data: T
  msg: string
}
