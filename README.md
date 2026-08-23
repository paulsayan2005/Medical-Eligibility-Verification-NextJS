# 🛡️ Medical Eligibility Verification

Enterprise Zero-Knowledge Medical Eligibility Verification built natively on the Midnight Network using Compact smart contracts, client-side ZK-SNARK proving, dual-state ledger privacy, and Next.js.

## 🔗 Links

[![Live Video](https://img.shields.io/badge/YouTube-Live_Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/-FJ9CQxYjNU)
[![Live Deployment](https://img.shields.io/badge/Vercel-Live_Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://medical-eligibility-verification-next-b7hew5odh-sayan-paul.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/paulsayan2005/Medical-Eligibility-Verification-NextJS)
[![CI/CD Pipeline](https://img.shields.io/badge/GitHub_Actions-CI/CD_Pipeline-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/paulsayan2005/Medical-Eligibility-Verification-NextJS/actions)
[![Smart Contract](https://img.shields.io/badge/Compact-Smart_Contract-8A2BE2?style=for-the-badge&logo=codeigniter&logoColor=white)](https://github.com/paulsayan2005/Medical-Eligibility-Verification-NextJS/tree/main/contract)
[![Midnight Network](https://img.shields.io/badge/Midnight-Network-000000?style=for-the-badge&logo=web3.js&logoColor=white)](https://midnight.network/)

## 📸 Application Screenshots

| Screen | Description |
| :--- | :--- |
| ![Landing Page](docs/screenshots/landing.png) | Hero section showcasing medical privacy, connected Midnight wallet, live Preprod network badge, and interactive eligibility exploration. |
| ![System Status](docs/screenshots/SystemStatus.png) | Real-time technical control panel, wallet connection status, live Preprod blockchain state, and verification status monitoring. |
| ![Verify Eligibility](docs/screenshots/Verify.png) | Private witness execution, client-side secret evaluation for Patient Age and Policy ID Hash, and medical eligibility verification portal. |

## 🧠 Executive Summary & Problem Statement

### The Problem
Traditional medical eligibility systems suffer from critical privacy flaws:
*   **Raw PII Exposure:** Patients are forced to present personal identifiers (names, exact ages, SSNs, policy IDs) to prove eligibility, creating massive identity leakage.
*   **On-Chain Surveillance:** In standard blockchain dApps, signing a transaction permanently links a public wallet address to physical medical history and timestamps on an immutable public ledger.
*   **Data Breach Vulnerabilities:** Centralized medical databases represent lucrative honeypots for credential harvesting and HIPAA violations.

### The Solution
Medical Eligibility Verification enables patients to mathematically prove their medical qualifications in Zero-Knowledge.
*   No exact ages, names, or credentials ever leave the patient's local device.
*   No wallet identities or personal identifiable information (PII) are published on-chain.
*   The Midnight ledger verifies the cryptographic proof, increments the aggregate eligibility counters, and records the verification state without compromising patient confidentiality.

## ⚙️ Working Principles & Cryptographic Flow

The platform leverages Midnight's dual-state architecture where private witness execution is strictly isolated on the client side, and only succinct ZK-SNARK proofs cross the network boundary:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ PATIENT'S LOCAL CLIENT                                                      │
│                                                                             │
│               [ Patient Age ] + [ Policy ID Hash ]                          │
│                                 ▼                                           │
│       (Private witness execution strictly inside browser/WASM)              │
│                                                                             │
│        ┌──────────────────────────────────────────────┐                     │
│        │          Midnight Compact Circuit            │                     │
│        │                                              │                     │
│        │ - secret evaluation against minAge           │ ← Midnight Prover   │
│        │ - verifyEligibility() constraint evaluation  │                     │
│        └──────────────────────┬───────────────────────┘                     │
│                               │                                             │
│                               ▼                                             │
│                     (ZK-SNARK Proof only)                                   │
└───────────────────────────────┼─────────────────────────────────────────────┘
                                ▼
         (Network Boundary: ZERO MEDICAL PII Transmitted)
┌─────────────────────────────────────────────────────────────────────────────┐
│ MIDNIGHT PREPROD LEDGER                                                     │
│                                                                             │
│ PUBLIC ON-CHAIN STATE:                                                      │
│ ✅ verificationCount — Aggregate verification counter incremented (+1)      │
│ ✅ eligibleCount — Aggregate eligible counter incremented                   │
│ ✅ ineligibleCount — Aggregate ineligible counter incremented               │
│                                                                             │
│ PROTECTED PRIVATE STATE (Never exposed or stored on-chain):                 │
│ ❌ patientAge — Exact age of the patient                                    │
│ ❌ policyIdHash — The exact policy identifier                               │
│ ❌ patientWalletId — Personal wallet address correlating to the patient     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🛡️ Midnight Privacy Model Breakdown

| Parameter | Visibility | Storage Location | Cryptographic Guarantee |
| :--- | :--- | :--- | :--- |
| **Patient Age** | 🔒 Private | Client RAM only | Never serialized over network; evaluated in ZK witness |
| **Policy ID Hash** | 🔒 Private | Ephemeral | Used locally to ensure valid policy, never revealed on ledger |
| **Patient Identity** | 🔒 Private | Off-Chain | Zero wallet-to-patient correlation on public ledger |
| **Verification Counters** | 🌐 Public | Midnight Ledger | Aggregate counters tracking overall system usage (eligible/ineligible) |
| **Boolean Outcome** | 🌐 Public | Midnight Ledger | Only the mathematical result (true/false) is exposed |

## 📖 Step-by-Step Developer & Operator Guide

### 1. System Requirements & Prerequisites
*   **Node.js**: v20.x (LTS recommended)
*   **Browser Extension**: [1AM Wallet](https://midnight.network/wallet) or [Midnight Lace](https://midnight.network/get-lace)
*   **Midnight Compiler**: `compactc` v0.31.1 (WSL/Ubuntu highly recommended for Windows)

### 2. Installation & Setup

```bash
# Clone repository
git clone https://github.com/paulsayan2005/Medical-Eligibility-Verification-NextJS.git
cd Medical-Eligibility-Verification-NextJS

# Install dependencies
npm install
```

### 3. Compile the Compact Contract

```bash
npm run compile
npm run build -w contract
```

### 4. Fund Testnet Wallet
Get testnet tDUST tokens from the official Faucet:
*   **Faucet URL**: [https://faucet.midnight.network/](https://faucet.midnight.network/)
*   **Required**: tDUST to pay transaction fees. 

### 5. Launch the Web Application

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000/).

### 6. Connect Wallet (1AM Wallet & Lace)
*   Click the "Connect 1AM Wallet" button in the top navigation bar.
*   The platform automatically scans `window.midnight` using the new SDK v5 and EIP-6963 style `.connect()` specification.
*   Approve the authorization prompt in your wallet extension.

### 7. Deploying Contracts to Midnight Preprod
Deployment requires tDUST. Once funded, you can deploy the contract manually:
```bash
npm run deploy
```
Once deployed, create a `.env` file in the root directory:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>
```

## ✅ Feature & Compliance Checklist

### Smart Contracts & ZK Circuits
- [x] Written in Midnight Compact Language (`contract/src/medical-eligibility-verification.compact`)
- [x] Private witness computation for medical credentials (age, policy hash)
- [x] Public state transitions for aggregate counters
- [x] Zero PII exposure on public ledger state

### DApp & Wallet Connector
- [x] Built with Next.js App Router and native TypeScript
- [x] Full compliance with official Midnight SDK v5 API
- [x] Native support for 1AM Wallet and Midnight Lace via DApp connector
- [x] Fallback mechanisms for legacy API connections
- [x] Premium Glassmorphism UI built with Tailwind CSS

## 🏛️ Real-World Sector Use Cases

| Sector | Practical Application |
| :--- | :--- |
| **Health Insurance** | Verify patient coverage levels at clinics without sharing full medical history. |
| **Pharmaceutical Trials** | Screen trial participants for age/condition criteria with mathematical privacy guarantees. |
| **Age-Restricted Products** | Prove age (21+) for medical dispensaries without exposing physical IDs or birthdates. |
| **Telehealth Access** | HIPAA and GDPR-compliant virtual waiting rooms where identity exposure violates patient confidentiality. |

## 🛠️ Monorepo Structure

```text
Medical-Eligibility-Verification-NextJS/
├── contract/                   # Compact ZK smart contracts
│   └── src/
│       └── medical-eligibility-verification.compact
├── contract-cli/               # Node.js CLI for testing + deployment
├── src/                        # Next.js App Router frontend
│   ├── app/                    # UI Pages (Landing, Verify, System)
│   ├── components/             # Reusable UI components (Navbar, WalletProvider)
│   └── lib/midnight/           # ZK utilities and Midnight provider logic
├── scripts/                    # Deployment scripts
├── docs/screenshots/           # Application screenshots
└── README.md                   # Primary documentation & user guide
```

## 📄 License
This project is open-source and distributed under the MIT License.
