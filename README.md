# Solana Arbitrage Bot

Lightweight Solana arbitrage bot built around Jupiter v6 quote/swap-instruction APIs and Jito bundle submission.

## Features

- Polls circular routes between WSOL and USDC.
- Calculates profit in lamports before sending a transaction.
- Applies a configurable Jito tip from profitable spread.
- Falls back to public Jupiter endpoints if local proxy is unavailable.
- Runs continuously in a simple loop.

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm
- A funded Solana keypair for transaction fees and execution

## Installation

```bash
npm install
```

## Environment

Create a `.env` file in the project root:

```env
SECRET_KEY=<your_secret_key>
```

The bot loads `SECRET_KEY` from environment via `@solana-developers/helpers`.

## Run

Development mode:

```bash
git clone https://github.com/Axiovant/Solana-Arbitrage-Bot
cd Solana-Arbitrage-Bot
npm run dev
```

Build and run:

```bash
npm run build
npm start
```

Type-check only:

```bash
npm run typecheck
```

## Runtime Defaults

Current defaults are configured in `src/config/runtime.ts`:

- RPC: `https://mainnet-ams.chainbuff.com`
- Local Jupiter endpoints:
  - `http://127.0.0.1:8080/quote`
  - `http://127.0.0.1:8080/swap-instructions`
- Public Jupiter fallback endpoints are enabled automatically.
- Base/quote pair: WSOL <-> USDC
- Poll interval: `200ms`

## Notes

- This bot executes on mainnet settings by default.
- Trading/arbitrage is high risk. Run with small amounts first.
- Keep secrets out of version control (do not commit `.env`).