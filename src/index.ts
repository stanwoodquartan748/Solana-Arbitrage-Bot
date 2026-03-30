import { payer } from "./config/env";
import { startArbitrageLoop } from "./bot/arbitrage-bot";

async function main(): Promise<void> {
  console.log("payer:", payer.publicKey.toBase58());
  await startArbitrageLoop(payer);
}

main().catch((error) => {
  console.error("fatal error:", error);
  process.exit(1);
});
