import 'dotenv/config';
import { PreprodConfig } from './boilerplate/contract-cli/src/config.js';
import { buildFreshWallet } from './boilerplate/contract-cli/src/api.js';
import * as Rx from 'rxjs';

async function run() {
  const config = new PreprodConfig();
  console.log('Building wallet...');
  const wallet = await buildFreshWallet(config);
  const state = await Rx.firstValueFrom(wallet.state());
  console.log('State keys:', Object.keys(state));
  console.log('coinPublicKey:', state.coinPublicKey);
  // Wait! Let's check if the wallet exposes an unshielded address formatting function!
  process.exit(0);
}
run().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
