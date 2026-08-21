require('dotenv/config');
const { setNetworkId } = require('@midnight-ntwrk/midnight-js-network-id');
const { WalletBuilder } = require('@midnight-ntwrk/wallet');

async function run() {
  setNetworkId('preprod');
  console.log('Building wallet...');
  const wallet = await WalletBuilder.buildFromSeed(
    'https://indexer.preprod.midnight.network/api/v4/graphql',
    'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    'http://127.0.0.1:6300',
    'https://rpc.preprod.midnight.network',
    'd7dcb931d76c987ce22ccafa0e0618a516ecccb57fa52ca2d6e64052b9356bc5',
    'preprod', // ZswapNetworkId? wait, does zswap accept 'preprod'?
    'info'
  );
  wallet.start();
  const state = await wallet.state().toPromise(); // RxJS 7+
  console.log('Address:', state.address);
  console.log('CoinPublicKey:', state.coinPublicKey);
  process.exit(0);
}
run().catch(console.error);
