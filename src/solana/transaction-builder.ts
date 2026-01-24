import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { SwapInstructionsResponse } from "../types/jupiter";
import { instructionFormat } from "../utils/instruction";

export async function buildArbitrageTransaction(input: {
  connection: Connection;
  payer: Keypair;
  tipReceiver: PublicKey;
  jitoTipLamports: number;
  instructions: SwapInstructionsResponse;
}): Promise<VersionedTransaction> {
  let ixs: TransactionInstruction[] = [];

  ixs.push(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: input.instructions.computeUnitLimit,
    }),
  );

  ixs = ixs.concat(input.instructions.setupInstructions.map(instructionFormat));
  ixs.push(instructionFormat(input.instructions.swapInstruction));

  ixs.push(
    SystemProgram.transfer({
      fromPubkey: input.payer.publicKey,
      toPubkey: input.tipReceiver,
      lamports: input.jitoTipLamports,
    }),
  );

  const addressLookupTableAccounts = (
    await Promise.all(
      input.instructions.addressLookupTableAddresses.map(async (address) => {
        const result = await input.connection.getAddressLookupTable(
          new PublicKey(address),
        );
        return result.value;
      }),
    )
  ).filter((alt): alt is NonNullable<typeof alt> => alt !== null);

  const { blockhash } = await input.connection.getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey: input.payer.publicKey,
    recentBlockhash: blockhash,
    instructions: ixs,
  }).compileToV0Message(addressLookupTableAccounts);

  const transaction = new VersionedTransaction(messageV0);
  transaction.sign([input.payer]);
  return transaction;
}
