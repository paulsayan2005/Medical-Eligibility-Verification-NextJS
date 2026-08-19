import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { getZswapNetworkId, setNetworkId, NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { firstValueFrom } from 'rxjs';

const configs = [
  { name: 'TestNet', id: NetworkId.TestNet },
  { name: 'DevNet', id: NetworkId.DevNet },
  { name: 'Undeployed', id: NetworkId.Undeployed },
];

const seed = '2fc33e7832759f4b8410dc875324079ba98fe7d4be263f9382cd0ddbf02ad042';
const indexer = 'https://indexer.preprod.midnight.network/api/v4/graphql';
const indexerWS = 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
const node = 'https://rpc.preprod.midnight.network';
const proofServer = 'http://127.0.0.1:6300';

for (const cfg of configs) {
  try {
    setNetworkId(cfg.id);
    const networkId = getZswapNetworkId();
    console.log(`\nTesting NetworkId.${cfg.name} (zswap networkId=${networkId})...`);
    const wallet = await WalletBuilder.buildFromSeed(indexer, indexerWS, proofServer, node, seed, networkId, 'error');
    wallet.start();
    const state = await firstValueFrom(wallet.state());
    console.log(`  Shielded Address: ${state.address}`);
    await wallet.close();
  } catch(e) {
    console.log(`  ERROR: ${e.message}`);
  }
}
