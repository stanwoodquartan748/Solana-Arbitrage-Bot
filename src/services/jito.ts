import axios from "axios";
import bs58 from "bs58";
import { jitoBundleUrl } from "../config/runtime";
import { SendBundleRequest, SendBundleResponse } from "../types/jito";

export async function sendJitoBundle(
  serializedTransaction: Uint8Array,
): Promise<string> {
  const base58Transaction = bs58.encode(serializedTransaction);
  const payload: SendBundleRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "sendBundle",
    params: [[base58Transaction]],
  };

  const response = await axios.post<SendBundleResponse>(jitoBundleUrl, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.result;
}
