import axios from "axios";
import {
  publicQuoteUrls,
  publicSwapInstructionUrls,
  quoteUrl,
  swapInstructionUrl,
} from "../config/runtime";
import {
  QuoteParams,
  QuoteResponse,
  SwapInstructionsResponse,
} from "../types/jupiter";

export async function fetchQuote(params: QuoteParams): Promise<QuoteResponse> {
  try {
    const response = await axios.get<QuoteResponse>(quoteUrl, { params });
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }
    return fetchFromPublicQuotes(params);
  }
}

export async function fetchSwapInstructions(input: {
  userPublicKey: string;
  quoteResponse: QuoteResponse;
}): Promise<SwapInstructionsResponse> {
  const swapData = {
    userPublicKey: input.userPublicKey,
    wrapAndUnwrapSol: false,
    useSharedAccounts: false,
    computeUnitPriceMicroLamports: 1,
    dynamicComputeUnitLimit: true,
    skipUserAccountsRpcCalls: true,
    quoteResponse: input.quoteResponse,
  };

  try {
    const response = await axios.post<SwapInstructionsResponse>(
      swapInstructionUrl,
      swapData,
    );
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }
    return fetchFromPublicSwapInstructions(swapData);
  }
}

async function fetchFromPublicQuotes(
  params: QuoteParams,
): Promise<QuoteResponse> {
  let lastError: unknown;

  for (const url of publicQuoteUrls) {
    try {
      const response = await axios.get<QuoteResponse>(url, { params });
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function fetchFromPublicSwapInstructions(swapData: {
  userPublicKey: string;
  wrapAndUnwrapSol: boolean;
  useSharedAccounts: boolean;
  computeUnitPriceMicroLamports: number;
  dynamicComputeUnitLimit: boolean;
  skipUserAccountsRpcCalls: boolean;
  quoteResponse: QuoteResponse;
}): Promise<SwapInstructionsResponse> {
  let lastError: unknown;

  for (const url of publicSwapInstructionUrls) {
    try {
      const response = await axios.post<SwapInstructionsResponse>(url, swapData);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function shouldFallback(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  // Local Jupiter proxy might be down/refusing connections; fallback to public API.
  if (!error.response) {
    return true;
  }

  return error.response.status >= 500;
}

export function mergeCircularQuotes(input: {
  firstLeg: QuoteResponse;
  secondLeg: QuoteResponse;
  initialInputAmount: number;
  jitoTipLamports: number;
}): QuoteResponse {
  const targetOutAmount = String(
    input.initialInputAmount + input.jitoTipLamports,
  );

  return {
    ...input.firstLeg,
    outputMint: input.secondLeg.outputMint,
    outAmount: targetOutAmount,
    otherAmountThreshold: targetOutAmount,
    priceImpactPct: "0",
    routePlan: [...input.firstLeg.routePlan, ...input.secondLeg.routePlan],
  };
}
