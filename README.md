# Medical Eligibility Verification

A Midnight dApp for Medical Eligibility Verification using Confidential Credentials (ZK proofs) to verify patient criteria without exposing sensitive data.

## Contract Address

| Network | Contract Address |
|---------|------------------|
| Preprod | `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` |

## Features

*   **Zero-Knowledge Age Verification:** Verify a patient is above a certain age without revealing their actual date of birth.
*   **Confidential Policy Verification:** Verify the patient holds a valid medical policy without revealing the policy ID on the public ledger.
*   **Public Statistics:** Maintains a public, auditable tally of successful and failed eligibility checks.
*   **Midnight Wallet Integration:** Full integration with the Midnight Lace wallet for transaction signing and proof generation.

## What This Project Does

This project provides a decentralized system for medical clinics or pharmacies to verify if a patient is eligible for a specific treatment or medication. It ensures the patient meets age requirements and possesses valid insurance, all while completely protecting the patient's private medical information. The system uses zero-knowledge proofs to assert these facts on the Midnight blockchain. The public ledger only sees whether the verification succeeded or failed, not the underlying private data.

## Privacy Model

*   **Public Information:** 
    *   `verificationCount`: The total number of eligibility checks performed.
    *   `eligibleCount`: The total number of successful eligibility checks.
    *   `ineligibleCount`: The total number of failed eligibility checks.
    *   The final eligibility result (Boolean) of each check.
*   **Private Information:** 
    *   The patient's actual age.
    *   The patient's medical policy ID hash.
*   **What users prove without revealing:** 
    *   Users prove that their age is greater than or equal to a required `minAge` and that their `policyHash` is not empty, entirely off-chain using Zero-Knowledge (ZK) proofs. The network only verifies the proof without ever seeing the private inputs.

## Tech Stack

*   **Smart Contract:** Midnight Compact (TypeScript-like ZK language)
*   **Frontend:** Next.js (React), Tailwind CSS
*   **Blockchain SDK:** Midnight.js (V4)
*   **Tooling:** Node.js, Docker (Midnight Proof Server)

## Folder Structure

*   `boilerplate/contract/`: Contains the Midnight Compact smart contract (`medical-eligibility-verification.compact`) and its build configuration.
*   `boilerplate/contract-cli/`: CLI tool and deployment scripts for interacting with the contract.
*   `boilerplate/frontend/`: The Next.js frontend application.
*   `boilerplate/scripts/`: Helper scripts for wallet management and network interaction.

## Prerequisites

*   Node.js v22 installed.
*   Docker installed and running.
*   Midnight Compact Compiler installed globally: `npm install -g @midnight-ntwrk/compact-compiler`
*   Midnight Proof Server running locally in Docker: `docker run -p 6300:6300 midnightnetwork/proof-server`
*   Midnight Lace Browser Extension (configured to Preprod network).

## Installation

1. Clone the repository.
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
4. Install CLI dependencies:
   ```bash
   cd boilerplate/contract-cli
   npm install
   cd ../..
   ```
5. Install frontend dependencies:
   ```bash
   cd boilerplate/frontend
   npm install
   cd ../..
   ```

## Compile

Compile the Compact smart contract:

```bash
npm run compile
```

## Build

Build the workspace packages (Contract, CLI, and Frontend):

```bash
npm run build
```

## Manual Deployment

Deployment is intentionally skipped at this stage. 
To manually deploy the contract to the Midnight Preprod network, ensure your `contract-cli` wallet has sufficient testnet funds and run:

```bash
NODE_OPTIONS="--max-old-space-size=12288" npm run deploy -- --network preprod
```
*(Note: If using the provided workspace scripts, you may also use `npm run deploy` from the root depending on your configuration.)*

## After Deployment

After you have manually deployed the contract:
1. Copy the deployed contract address from the terminal output.
2. Replace every occurrence of `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` in this `README.md` with your actual address.
3. Update the frontend environment variable in `boilerplate/frontend/.env` or the config file with the new address.
4. Restart the frontend server.

## Environment Variables

The frontend requires the following environment variables (typically stored in `.env` inside `boilerplate/frontend`):

*   `NEXT_PUBLIC_CONTRACT_ADDRESS`: The deployed contract address on the Midnight Preprod network.
*   `NEXT_PUBLIC_INDEXER_URL`: (Optional) The Midnight Preprod Indexer URL.
*   `NEXT_PUBLIC_NODE_URL`: (Optional) The Midnight Preprod Node URL.

## Screenshots

*(Placeholder for screenshots of the running dApp)*

## Initial Idea

Medical Eligibility Verification

## Troubleshooting

*   **Wallet Initialization Errors:** Ensure your 1AM/Midnight seed phrase is correct in your configuration and that your wallet holds sufficient testnet tokens.
*   **Sync Hangs:** If the deployment or CLI hangs while syncing, it may be downloading a large number of blocks. Allow a few minutes for the initial sync to complete.
*   **Compilation Errors:** Verify that the `compact` compiler is installed and matches the version specified in the `package.json`.
