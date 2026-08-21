import * as sdk from '@midnight-ntwrk/wallet-sdk';
import * as ledger from '@midnight-ntwrk/ledger';
import { getNetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { webcrypto } from 'crypto';

setNetworkId('preprod');

async function run() {
  const seed = new Uint8Array(32);
  webcrypto.getRandomValues(seed);
  
  const walletFacade = await sdk.WalletFacade.init({
      configuration: {
          indexerClientConnection: { indexerHttpUrl: 'http://127.0.0.1:8088/api/v1/graphql', indexerWsUrl: 'ws://127.0.0.1:8088/api/v1/graphql/ws' },
          nodeClientConnection: { nodeHttpUrl: 'http://127.0.0.1:9944' },
          provingServerUrl: 'http://127.0.0.1:6300',
          walletId: 'test-wallet',
          transactionHistoryStorage: new sdk.NoOpTransactionHistoryStorage(),
          networkId: getNetworkId(),
          logger: console,
          transactionCacheTTL: 1000 * 60 * 60,
          pendingTransactionsPollingInterval: 1000 * 5,
      },
      shielded: sdk.ShieldedWallet,
      unshielded: sdk.UnshieldedWallet,
      dust: sdk.DustWallet
  });
  
  const zswapKeys = ledger.ZswapSecretKeys.fromSeed(seed);
  const dustKey = ledger.DustSecretKey.fromSeed(seed);

  await walletFacade.start(zswapKeys, dustKey);

  const state = await walletFacade.waitForSyncedState();
  console.log('Facade created!', state.unshielded.address);
}

run().catch(console.error);
