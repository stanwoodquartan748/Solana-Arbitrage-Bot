export interface SendBundleRequest {
  jsonrpc: "2.0";
  id: number;
  method: "sendBundle";
  params: string[][];
}

export interface SendBundleResponse {
  result: string;
}
