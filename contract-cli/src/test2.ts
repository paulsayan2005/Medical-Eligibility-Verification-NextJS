import { setNetworkId, NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { randomBytes } from 'crypto';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import * as Rx from 'rxjs';

async function test() {
  const seed = toHex(randomBytes(32));
  setNetworkId(NetworkId.TestNet);
  const w = await WalletBuilder.buildFromSeed(
    'http://127.0.0.1:8088',
    'ws://127.0.0.1:8088',
    'http://127.0.0.1:6300',
    'http://127.0.0.1:9944',
    seed,
    getZswapNetworkId(),
    'error'
  );
  w.start();
  const state: any = await Rx.firstValueFrom(w.state());
  console.log('address:', state.address);
  console.log('addressLegacy:', state.addressLegacy);
  console.log('coinPublicKey:', state.coinPublicKey);
  console.log('Keys:', Object.keys(state));
  await w.close();
}
test().catch(console.error);
