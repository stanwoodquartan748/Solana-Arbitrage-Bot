import { Connection, PublicKey } from "@solana/web3.js";
import {
  DEFAULT_INPUT_AMOUNT_LAMPORTS,
  DEFAULT_JITO_TIP_PERCENT,
  DEFAULT_PROFIT_THRESHOLD_LAMPORTS,
  USDC_MINT,
  WSOL_MINT,
} from "../constants/markets";

export const connection = new Connection(
  "https://mainnet-ams.chainbuff.com",
  "processed",
);

export const quoteUrl = "http://127.0.0.1:8080/quote";
export const swapInstructionUrl = "http://127.0.0.1:8080/swap-instructions";
export const publicQuoteUrls = [
  "https://lite-api.jup.ag/swap/v1/quote",
  "https://api.jup.ag/swap/v1/quote",
];
export const publicSwapInstructionUrls = [
  "https://lite-api.jup.ag/swap/v1/swap-instructions",
  "https://api.jup.ag/swap/v1/swap-instructions",
];
export const jitoBundleUrl =
  "https://frankfurt.mainnet.block-engine.jito.wtf/api/v1/bundles";

export const tipReceiver = new PublicKey(
  "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
);

export const botConfig = {
  baseMint: WSOL_MINT,
  quoteMint: USDC_MINT,
  inputAmountLamports: DEFAULT_INPUT_AMOUNT_LAMPORTS,
  profitThresholdLamports: DEFAULT_PROFIT_THRESHOLD_LAMPORTS,
  jitoTipPercent: DEFAULT_JITO_TIP_PERCENT,
  pollIntervalMs: 200,
};
