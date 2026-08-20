# Medical Eligibility Verification

A privacy-preserving zero-knowledge medical eligibility verification platform built on the Midnight Network using Compact smart contracts.

## Contract Address

| Network | Contract Address |
|---------|------------------|
| Preprod | `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` |

## Features

- **Zero-Knowledge Verification**: Prove medical eligibility without revealing exact age or policy ID.
- **Privacy-Preserving State**: Private data remains exclusively on the user's local device.
- **Midnight Lace Integration**: Seamlessly connect using the Midnight Lace wallet.
- **Transparent Audit Log**: On-chain verification history of eligibility claims.
- **Responsive Dashboard**: Built with Next.js and styled for modern aesthetics.

## What This Project Does

This project is a decentralized application (dApp) for verifying patient medical eligibility in a completely confidential manner. Traditional healthcare systems require patients to share highly sensitive information like exact age, policy number, and diagnosis codes. Instead, this dApp uses Midnight’s zero-knowledge proofs to allow a patient to mathematically prove they meet specific requirements (e.g., minimum age and a valid policy) while keeping the underlying data strictly private. Service providers receive a verifiable "eligible" or "ineligible" boolean result without ever seeing the patient's sensitive data.

## Privacy Model

- **Public Information**: Minimum age requirement, verification count, eligible/ineligible count, and the final eligibility boolean result.
- **Private Information**: Patient's exact age (0-255) and their 32-byte Policy ID hash.
- **What users prove without revealing**: Patients prove that their age is greater than or equal to the minimum age threshold, and that their policy hash is valid (not empty), without revealing the actual age or policy hash on the blockchain.

## Tech Stack

- **Smart Contract**: Midnight Compact (`medical-eligibility-verification.compact`)
- **Frontend**: Next.js (React), Tailwind CSS, TypeScript
- **Wallet**: Midnight Lace Wallet Extension (`window.midnight.mnLace`)
- **Tooling**: `@midnight-ntwrk/compact-compiler`, Node.js v22, Docker

## Folder Structure

```
Medical-Eligibility-Verification/
├── boilerplate/
│   ├── contract/
│   │   └── src/
│   │       ├── medical-eligibility-verification.compact
│   │       ├── witnesses.ts
│   │       └── index.ts
│   ├── contract-cli/
│   │   └── src/
│   │       ├── cli.ts
│   │       └── api.ts
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── api.ts
│   │   └── package.json
│   └── scripts/
├── PROPOSAL.md
└── package.json
```

## Prerequisites

- **Node.js v22** installed.
- **Docker** installed and running (for the Midnight Proof Server).
- **Midnight Lace Wallet** extension installed in your browser.
- **Compact Compiler** installed globally: `npm install -g @midnight-ntwrk/compact-compiler`.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/paulsayan2005/Medical-Eligibility-Verification.git
   cd Medical-Eligibility-Verification
   ```
2. Install root dependencies:
   ```bash
   npm install
   ```
3. Install contract dependencies:
   ```bash
   cd boilerplate/contract
   npm install
   cd ../..
   ```
4. Install frontend dependencies:
   ```bash
   cd boilerplate/frontend
   npm install
   cd ../..
   ```
5. Install CLI dependencies:
   ```bash
   cd boilerplate/contract-cli
   npm install
   cd ../..
   ```

## Build

To build the entire project (Contracts, CLI, and Frontend):

```bash
npm run build
```

Alternatively, to build individual workspaces:

```bash
npm run build -w boilerplate/contract
npm run build -w boilerplate/contract-cli
npm run build -w boilerplate/frontend
```

## Compile

To compile the Compact contract and generate the Zero-Knowledge circuits:

```bash
npm run compile
```

Make sure you have Docker running and the `midnightnetwork/proof-server` pulled:
```bash
docker run -d -p 6300:6300 midnightnetwork/proof-server
```

## Manual Deployment

Deployment is intentionally skipped. You must deploy the contract manually to the Preprod network to get the contract address.

Run the following command to deploy:

```bash
NODE_OPTIONS="--max-old-space-size=12288" npm run deploy:new -- --network preprod
```

Wait for the deployment to finish and copy the generated contract address.

## After Deployment

1. Deploy the Compact contract using the command above.
2. Copy the deployed contract address.
3. Replace every occurrence of `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` in the codebase (including this README, frontend configuration, and environment files) with the deployed contract address.

## Environment Variables

In `boilerplate/frontend/.env.local` (or `.env`):

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>
NEXT_PUBLIC_INDEXER_URL=https://indexer.preprod.midnight.network/api/v4/graphql
NEXT_PUBLIC_NODE_URL=https://rpc.preprod.midnight.network
NEXT_PUBLIC_PROOF_SERVER_URL=http://127.0.0.1:6300
```

## Screenshots

[PLACEHOLDER_FOR_SCREENSHOTS]

## Initial Idea

[PLACEHOLDER_FOR_INITIAL_IDEA]

## Troubleshooting

- **Compiler Error (`compactc: not found`)**: Ensure that the Compact compiler is installed. You can install it via `npm install -g @midnight-ntwrk/compact-compiler`.
- **Proof Server Connection Refused**: Ensure Docker is running and the Midnight proof server container is actively listening on port `6300`.
- **Wallet Connection Issues**: Ensure you have unlocked your Midnight Lace wallet and switched it to the `Preprod` network.
