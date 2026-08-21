// @ts-nocheck
/**
 * Medical Eligibility Verification — Contract CLI API
 *
 * Uses @midnight-ntwrk/midnight-js-* (v4.x) provider-based pattern for deployment.
 * WalletFacade from @midnight-ntwrk/wallet-sdk is used only for address derivation.
 * Contract deployment uses the standalone provider approach (not WalletFacade).
 */
import type { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import compactRuntime from '@midnight-ntwrk/compact-runtime';
const { assertIsContractAddress } = compactRuntime;
import { witnesses, contracts, type EligibilityPrivateState } from '@midnight-ntwrk/contract';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import * as Rx from 'rxjs';
import { webcrypto } from 'node:crypto';
import { type Logger } from 'pino';
import { WebSocket } from 'ws';
import { type Config, contractConfig } from './config.js';
import type { EligibilityLedgerState } from './common-types.js';

// @ts-expect-error: Enable WebSocket for Apollo client
globalThis.WebSocket = WebSocket;

const contractModule = contracts.MedicalEligibilityVerification;

let logger: Logger;

export function setLogger(_logger: Logger) {
  logger = _logger;
}

// ============================================================
// Provider types
// ============================================================
type EligibilityPrivateStateId = 'eligibilityPrivateState';

type EligibilityProviders = {
  walletProvider: any;
  midnightProvider: any;
  publicDataProvider: ReturnType<typeof indexerPublicDataProvider>;
  zkConfigProvider: NodeZkConfigProvider<'verifyEligibility'>;
  proofProvider: ReturnType<typeof httpClientProofProvider>;
  privateStateProvider: ReturnType<typeof levelPrivateStateProvider<EligibilityPrivateStateId>>;
};

// ============================================================
// Ledger state query
// ============================================================
export const getEligibilityLedgerState = async (
  providers: EligibilityProviders,
  contractAddress: ContractAddress,
): Promise<EligibilityLedgerState | null> => {
  assertIsContractAddress(contractAddress);
  logger?.info('Querying public ledger state...');
  const contractState = await providers.publicDataProvider.queryContractState(contractAddress);
  if (contractState == null) return null;

  const ledger = contractModule.ledger(contractState.data);
  return {
    verificationCount: ledger.verificationCount ?? 0n,
    eligibleCount: ledger.eligibleCount ?? 0n,
    ineligibleCount: ledger.ineligibleCount ?? 0n,
  };
};

// ============================================================
// Contract deployment
// ============================================================
export const deployEligibilityContract = async (
  providers: EligibilityProviders,
  initialPrivateState: EligibilityPrivateState,
) => {
  logger?.info('Deploying Medical Eligibility Verification contract...');

  const eligibilityContractInstance = new contractModule.Contract(witnesses);

  const deployed = await deployContract(providers, {
    contract: eligibilityContractInstance,
    privateStateId: 'eligibilityPrivateState',
    initialPrivateState,
  });

  const address = deployed.deployTxData.public.contractAddress;
  logger?.info(`✅ Contract deployed at: ${address}`);
  return deployed;
};

// ============================================================
// Join existing deployed contract
// ============================================================
export const joinEligibilityContract = async (
  providers: EligibilityProviders,
  contractAddress: string,
  initialPrivateState: EligibilityPrivateState,
) => {
  const eligibilityContractInstance = new contractModule.Contract(witnesses);

  const joined = await findDeployedContract(providers, {
    contractAddress,
    contract: eligibilityContractInstance,
    privateStateId: 'eligibilityPrivateState',
    initialPrivateState,
  });

  logger?.info(`Joined contract at: ${joined.deployTxData.public.contractAddress}`);
  return joined;
};

// ============================================================
// Call verifyEligibility circuit
// ============================================================
export const verifyEligibility = async (
  providers: EligibilityProviders,
  contractAddress: string,
  minAge: number,
  privateState: EligibilityPrivateState,
): Promise<boolean> => {
  const joined = await joinEligibilityContract(providers, contractAddress, privateState);

  logger?.info(`Calling verifyEligibility(minAge=${minAge})...`);
  const txData = await joined.callTx.verifyEligibility(BigInt(minAge));
  logger?.info(`Transaction submitted: ${toHex(txData.public.txId)}`);

  const state = await getEligibilityLedgerState(providers, contractAddress as ContractAddress);
  if (!state) return false;

  const wasEligible = state.eligibleCount > 0n;
  logger?.info(`Verification result: ${wasEligible ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}`);
  return wasEligible;
};

// ============================================================
// Wallet helpers — V4 SDK (ShieldedWallet via wallet-sdk-shielded)
// ============================================================
import { ShieldedWallet, type ShieldedWalletAPI } from '@midnight-ntwrk/wallet-sdk-shielded';
import { UnshieldedWallet, type UnshieldedWalletAPI } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { DustWallet, type DustWalletAPI } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { NetworkId, NoOpTransactionHistoryStorage } from '@midnight-ntwrk/wallet-sdk-abstractions';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import * as ledger from '@midnight-ntwrk/ledger-v8';

/**
 * Derives the ZSwap secret keys from a 32-byte seed using BIP-44 paths.
 * These are used to create the shielded wallet (for on-chain coins).
 */
const deriveZswapKeys = (seed: Uint8Array): { zswapKeys: any; dustKey: any } => {
  const result = HDWallet.fromSeed(seed);
  if (result.type !== 'seedOk') throw new Error('Invalid seed for HDWallet');
  const hd = result.hdWallet;

  const zswapAcct = hd.selectAccount(0).selectRole(Roles.Zswap);
  const dustAcct = hd.selectAccount(0).selectRole(Roles.Dust);

  // Derive first key for each role
  const zswapResult = zswapAcct.deriveKeyAt(0);
  const dustResult = dustAcct.deriveKeyAt(0);

  if (zswapResult.type !== 'keyDerived') throw new Error('Could not derive Zswap key');
  if (dustResult.type !== 'keyDerived') throw new Error('Could not derive Dust key');

  return { zswapKeys: zswapResult.key, dustKey: dustResult.key };
};

/**
 * Builds a V4 wallet facade and waits for it to detect funded balance.
 * Returns the wallet facade along with the derived shielded address for the faucet.
 */
export const buildWalletAndWaitForFunds = async (
  { indexer, indexerWS, node, proofServer }: Config,
  seed: string,
  _filename = '',
): Promise<{ address: string; balances: Record<string, bigint>; shieldedInstance: ShieldedWalletAPI }> => {
  logger?.info(`Building V4 wallet from seed...`);
  logger?.info(`Network: indexer=${indexer}`);

  const seedBytes = new Uint8Array(Buffer.from(seed, 'hex'));

  // Get keys directly from ledger-v8 to avoid instanceof errors
  // with HDWallet's bundled ledger instance
  const zswapKeys = ledger.ZswapSecretKeys.fromSeed(seedBytes);

  const networkId = 'preprod';

  const config = {
    networkId,
    indexerClientConnection: {
      indexerHttpUrl: indexer,
      indexerWsUrl: indexerWS,
    },
    nodeClientConnection: {
      nodeHttpUrl: node,
    },
    provingServerUrl: proofServer,
    txHistoryStorage: new NoOpTransactionHistoryStorage(),
  };

  const ShieldedWalletClass = (ShieldedWallet as any)(config);
  const shieldedInstance = ShieldedWalletClass.startWithSeed(seedBytes) as ShieldedWalletAPI;

  // Start sync loops with the properly instantiated keys
  await shieldedInstance.start(zswapKeys as any);

  const shieldedAddrObj = await shieldedInstance.getAddress();
  const shieldedAddr = typeof shieldedAddrObj === 'string' ? shieldedAddrObj : 
                       (shieldedAddrObj as any)?.asString?.() ?? 
                       '[ShieldedAddress Object]';
                       
  logger?.info(`Shielded wallet address: ${shieldedAddr}`);

  // Allow a gap to prevent hanging indefinitely on Preprod
  const state = await shieldedInstance.waitForSyncedState(9999n);
  const balances = (state?.balances ?? {}) as Record<string, bigint>;

  return { address: shieldedAddr, balances, shieldedInstance };
};


// ============================================================
// Build providers for contract interaction (uses original V4 provider pattern)
// ============================================================
export const configureProviders = async (
  seed: string,
  config: Config,
  shieldedInstance?: ShieldedWalletAPI,
): Promise<EligibilityProviders> => {
  const seedBytes = new Uint8Array(Buffer.from(seed, 'hex'));

  // Get keys directly from ledger-v8 for balancing
  const zswapKeys = ledger.ZswapSecretKeys.fromSeed(seedBytes);
  const coinPublicKey = toHex(zswapKeys.coinPublicKey());

  const walletAndMidnightProvider = {
    getCoinPublicKey: () => coinPublicKey,
    getEncryptionPublicKey: () => coinPublicKey, // simplified
    balanceTx: async (tx: any, ttl?: Date): Promise<any> => {
      if (shieldedInstance) {
        logger?.info('Balancing transaction using ShieldedWallet...');
        const balanced = await shieldedInstance.balanceTransaction(zswapKeys as any, tx);
        return balanced.transaction;
      }
      return tx;
    },
    submitTx: async (tx: any): Promise<any> => {
      const nodeClient = await import('@midnight-ntwrk/midnight-js-node-provider');
      const provider = nodeClient.nodeMidnightProvider(config.node);
      return provider.submitTx(tx);
    },
    watchForTxData: (txId: string): Promise<any> => {
      return providers.publicDataProvider.watchForTxData(txId);
    },
  };

  const providers: EligibilityProviders = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: contractConfig.privateStateStoreName,
      privateStoragePasswordProvider: async () => Buffer.from(seedBytes).toString('hex').slice(0, 32),
      accountId: coinPublicKey.slice(0, 32),
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider: new NodeZkConfigProvider<'verifyEligibility'>(contractConfig.zkConfigPath),
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };

  return providers;
};

export const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  webcrypto.getRandomValues(bytes);
  return bytes;
};

export const buildFreshWallet = async (config: Config) =>
  buildWalletAndWaitForFunds(config, toHex(randomBytes(32)));
