export interface QuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  onlyDirectRoutes: boolean;
  slippageBps: number;
  maxAccounts: number;
}

export interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  priceImpactPct: string;
  routePlan: unknown[];
  contextSlot: number;
}

export interface RawInstructionAccount {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
}

export interface RawInstruction {
  programId: string;
  accounts: RawInstructionAccount[];
  data: string;
}

export interface SwapInstructionsResponse {
  computeUnitLimit: number;
  setupInstructions: RawInstruction[];
  swapInstruction: RawInstruction;
  addressLookupTableAddresses: string[];
}
