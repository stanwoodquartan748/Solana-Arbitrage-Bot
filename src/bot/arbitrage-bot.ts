import { Keypair } from "@solana/web3.js";
// st-biginteger does not publish TypeScript typings.
// @ts-expect-error - allow importing untyped package without local d.ts.
import { Big } from "st-biginteger";
import { botConfig, connection, tipReceiver } from "../config/runtime";
import {
  fetchQuote,
  fetchSwapInstructions,
  mergeCircularQuotes,
} from "../services/jupiter";
import { sendJitoBundle } from "../services/jito";
import { buildArbitrageTransaction } from "../solana/transaction-builder";
import { QuoteParams } from "../types/jupiter";
import { wait } from "../utils/sleep";

export async function runArbitrageCycle(payer: Keypair): Promise<void> {
  const start = Date.now();

  const quote0Params: QuoteParams = {
    inputMint: botConfig.baseMint,
    outputMint: botConfig.quoteMint,
    amount: botConfig.inputAmountLamports,
    onlyDirectRoutes: false,
    slippageBps: 0,
    maxAccounts: 20,
  };

  const quote0 = await fetchQuote(quote0Params);
  const quote1 = await fetchQuote({
    ...quote0Params,
    inputMint: botConfig.quoteMint,
    outputMint: botConfig.baseMint,
    amount: Number(quote0.outAmount),
  });

  const inputAmount = new Big(quote0Params.amount);
  const outAmount = new Big(quote1.outAmount);
  const diffLamports = outAmount.minus(inputAmount);
  console.log("diffLamports:", diffLamports.toString());

  if (diffLamports.lte(new Big(botConfig.profitThresholdLamports))) {
    return;
  }

  const jitoTipLamportsBig = diffLamports
    .times(botConfig.jitoTipPercent)
    .round(0, 0);
  const jitoTipLamports = Number(jitoTipLamportsBig.toString());

  if (!Number.isSafeInteger(jitoTipLamports)) {
    throw new Error("jito tip lamports exceeds JS safe integer range");
  }

  const mergedQuote = mergeCircularQuotes({
    firstLeg: quote0,
    secondLeg: quote1,
    initialInputAmount: quote0Params.amount,
    jitoTipLamports,
  });

  const instructions = await fetchSwapInstructions({
    userPublicKey: payer.publicKey.toBase58(),
    quoteResponse: mergedQuote,
  });

  const transaction = await buildArbitrageTransaction({
    connection,
    payer,
    tipReceiver,
    jitoTipLamports,
    instructions,
  });

  const bundleId = await sendJitoBundle(transaction.serialize());
  const duration = Date.now() - start;

  console.log(`sent to frankfurt, bundle id: ${bundleId}`);
  console.log(`${botConfig.baseMint} - ${botConfig.quoteMint}`);
  console.log(`slot: ${mergedQuote.contextSlot}, total duration: ${duration}ms`);
}

export async function startArbitrageLoop(payer: Keypair): Promise<void> {
  for (;;) {
    await runArbitrageCycle(payer);
    await wait(botConfig.pollIntervalMs);
  }
}
