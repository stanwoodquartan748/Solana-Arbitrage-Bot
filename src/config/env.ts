import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

export const payer = getKeypairFromEnvironment("SECRET_KEY");
