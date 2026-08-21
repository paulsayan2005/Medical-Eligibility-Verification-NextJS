import * as sdk from '@midnight-ntwrk/wallet-sdk';
import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { webcrypto } from 'crypto';
const config = {
  indexerClientConnection: { indexerHttpUrl: 'http://localhost' },
  nodeClientConnection: { nodeHttpUrl: 'http://localhost' },
  provingServerUrl: 'http://localhost',
  walletId: 'test-wallet',
  transactionHistoryStorage: new sdk.NoOpTransactionHistoryStorage(),
  networkId: getNetworkId(),
  logger: console,
};
const seed = new Uint8Array(32);
webcrypto.getRandomValues(seed);
try {
  const shieldedClass = sdk.ShieldedWallet(config);
  console.log('Shielded class:', shieldedClass);
  const shieldedWallet = shieldedClass.startWithSeed(seed);
  console.log('Shielded wallet:', shieldedWallet);
} catch (e) {
  console.error(e);
}
