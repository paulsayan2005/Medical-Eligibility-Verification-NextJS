// api.ts - Frontend API layer for Medical Eligibility Verification
//
// NOTE: @midnight-ntwrk/compact-runtime is a CJS+WASM module that cannot be
// statically imported in the browser. All contract/runtime imports are done
// lazily inside functions so that the UI can render first.

import type { MidnightProvider, WalletProvider, PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types';
import type { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import type { DAppConnectorAPI, DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import type { Logger } from 'pino';
import { currentConfig, contractConfig } from './config.js';

export type EligibilityLedgerState = {
  verificationCount: bigint;
  eligibleCount: bigint;
  ineligibleCount: bigint;
};

export type EligibilityProviders = {
  walletProvider: WalletProvider;
  midnightProvider: MidnightProvider;
  publicDataProvider: any;
  zkConfigProvider: FetchZkConfigProvider<'verifyEligibility'>;
  proofProvider: any;
  privateStateProvider: PrivateStateProvider;
};

// In-memory private state provider for browser demo
class InMemoryPrivateStateProvider implements PrivateStateProvider {
  private states = new Map<string, any>();
  private keys = new Map<string, any>();

  async set(id: string, state: any): Promise<void> { this.states.set(id, state); }
  async get(id: string): Promise<any | null> { return this.states.get(id) || null; }
  async remove(id: string): Promise<void> { this.states.delete(id); }
  async clear(): Promise<void> { this.states.clear(); }
  async setSigningKey(addr: any, key: any): Promise<void> { this.keys.set(addr, key); }
  async getSigningKey(addr: any): Promise<any | null> { return this.keys.get(addr) || null; }
  async removeSigningKey(addr: any): Promise<void> { this.keys.delete(addr); }
  async clearSigningKeys(): Promise<void> { this.keys.clear(); }
}

let logger: Logger;
export const setLogger = (_logger: Logger) => {
  logger = _logger;
};

// ============================================================
// Providers
// ============================================================
export const configureProviders = async (
  _connectorAPI: DAppConnectorAPI,
  walletAPI: DAppConnectorWalletAPI
): Promise<EligibilityProviders> => {
  const state = await walletAPI.state();
  
  const walletProvider: WalletProvider = {
    coinPublicKey: state.coinPublicKey,
    encryptionPublicKey: state.encryptionPublicKey,
    balanceTx: (tx, newCoins) => walletAPI.balanceAndProveTransaction(tx as any, newCoins) as any,
  };

  const midnightProvider: MidnightProvider = {
    submitTx: walletAPI.submitTransaction.bind(walletAPI),
  };

  // Dynamically import Midnight SDK providers so they don't load at startup
  const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
  const { httpClientProofProvider } = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
  const { FetchZkConfigProvider } = await import('@midnight-ntwrk/midnight-js-fetch-zk-config-provider');

  return {
    publicDataProvider: indexerPublicDataProvider(currentConfig.indexer, currentConfig.indexerWS),
    zkConfigProvider: new FetchZkConfigProvider<'verifyEligibility'>(
      window.location.origin + contractConfig.zkConfigPath,
      fetch.bind(window)
    ),
    proofProvider: httpClientProofProvider(currentConfig.proofServer),
    walletProvider,
    midnightProvider,
    privateStateProvider: new InMemoryPrivateStateProvider(),
  };
};

// ============================================================
// Ledger Queries — lazy import to avoid WASM crash at startup
// ============================================================
export const getEligibilityLedgerState = async (
  providers: EligibilityProviders,
  contractAddress: string
): Promise<EligibilityLedgerState | null> => {
  try {
    const contractState = await providers.publicDataProvider.queryContractState(contractAddress as any);
    if (contractState == null) return null;

    const { contracts } = await import('@midnight-ntwrk/contract');
    const contractModule = contracts.MedicalEligibilityVerification;
    const ledger = contractModule.ledger(contractState.data);
    return {
      verificationCount: ledger.verificationCount ?? 0n,
      eligibleCount: ledger.eligibleCount ?? 0n,
      ineligibleCount: ledger.ineligibleCount ?? 0n,
    };
  } catch (e) {
    logger?.error('Failed to query ledger state (runtime may not be available in browser):' + e);
    return null;
  }
};

// ============================================================
// Contract Interactions — all lazy to avoid WASM crash
// ============================================================
export const joinEligibilityContract = async (
  providers: EligibilityProviders,
  contractAddress: string,
  initialPrivateState: any
) => {
  const { findDeployedContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const { contracts, witnesses } = await import('@midnight-ntwrk/contract');
  const contractModule = contracts.MedicalEligibilityVerification;
  const eligibilityContractInstance = new contractModule.Contract(witnesses);

  return findDeployedContract(providers, {
    contractAddress,
    contract: eligibilityContractInstance,
    privateStateId: contractConfig.privateStateStoreName,
    initialPrivateState,
  });
};

export const deployEligibilityContract = async (
  providers: EligibilityProviders,
  initialPrivateState: any
) => {
  const { deployContract } = await import('@midnight-ntwrk/midnight-js-contracts');
  const { contracts, witnesses } = await import('@midnight-ntwrk/contract');
  const contractModule = contracts.MedicalEligibilityVerification;
  const eligibilityContractInstance = new contractModule.Contract(witnesses);

  return deployContract(providers, {
    contract: eligibilityContractInstance,
    privateStateId: contractConfig.privateStateStoreName,
    initialPrivateState,
  });
};

export const verifyEligibility = async (
  providers: EligibilityProviders,
  contractAddress: string,
  minAge: number,
  privateState: any
): Promise<boolean> => {
  const { toHex } = await import('@midnight-ntwrk/midnight-js-utils');
  logger?.info(`Joining contract at ${contractAddress}...`);
  const joined = await joinEligibilityContract(providers, contractAddress, privateState);

  logger?.info('Generating proof (patientAge & policyHash remain local)...');
  const txData = await joined.callTx.verifyEligibility(BigInt(minAge));
  
  logger?.info(`Tx submitted: ${toHex(txData.public.txId as unknown as Uint8Array)}`);

  await new Promise(r => setTimeout(r, 2000));
  const state = await getEligibilityLedgerState(providers, contractAddress);
  
  if (!state) return false;
  return state.eligibleCount > 0n;
};
