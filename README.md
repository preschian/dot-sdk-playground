# Polkadot SDK Playground

A simple playground project for testing and comparing dedot and papi (polkadot-api) SDK functionality.

## About

This project is created to test and explore the capabilities of both dedot and papi (polkadot-api) SDKs. It demonstrates basic API usage for fetching account data across multiple Polkadot ecosystem networks using different SDK approaches.

## Project Structure

- **react-dedot/**: React app using the dedot SDK
- **react-papi/**: React app using the papi (polkadot-api) SDK

## Comparison

| sdk | build time (vercel) | js size (non-gzip) |
| --- | --- | --- |
| papi | 1m28s | 614 kB |
| dedot | 35s | 323 kB |

- https://dot-sdk-playground-react-papi.vercel.app/
- https://dot-sdk-playground-react-dedot.vercel.app/

> [!TIP]
> papi requires extra effort for dapp size optimization: https://papi.how/codegen#whitelist

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain APIs**: 
  - Dedot SDK
  - Polkadot API (@polkadot-api/descriptors)
- **Package Manager**: Bun

## Testing

Both apps connect to:
- **Polkadot**: Main network
- **Kusama**: Canary network  
- **Paseo**: Testnet

Enter any valid address or leave empty to use the default address for testing API responses.

## Getting Started

Navigate to either project directory and run:
```bash
bun install
bun run dev
```
