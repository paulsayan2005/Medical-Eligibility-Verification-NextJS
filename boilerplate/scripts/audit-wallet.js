import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { getZswapNetworkId, setNetworkId, NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { firstValueFrom } from 'rxjs';
import fs from 'node:fs';
import path from 'node:path';

async function audit() {
  console.log('==================================================');
  console.log('WALLET AUDIT & DIAGNOSTIC');
  console.log('==================================================');

  const envPath = path.resolve(process.cwd(), '.env');
  let seedHex = '';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/WALLET_SEED="?([^"\n]+)"?/);
    if (match) {
      seedHex = match[1].trim();
    }
  }

  if (!seedHex) {
    console.log('❌ No WALLET_SEED found in .env');
    return;
  }

  const isHex = /^[0-9a-fA-F]+$/.test(seedHex) && seedHex.length === 64;
  const isMnemonic = seedHex.includes(' ');
  console.log(`Seed type provided: ${isMnemonic ? 'BIP39 Mnemonic (24 words)' : isHex ? `Hex String (${seedHex.length} chars)` : 'Unknown Format'}`);

  if (isMnemonic) {
    console.log('❌ CLI deployment tool expects a 64-character Hex String for headless deployment.');
    console.log('   The 24-word Lace seed phrase cannot be directly used in the headless Midnight SDK.');
    return;
  }

  const indexer = 'https://indexer.preprod.midnight.network/api/v4/graphql';
  const indexerWS = 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
  const node = 'https://rpc.preprod.midnight.network';
  const proofServer = 'http://127.0.0.1:6300';

  console.log('\nNetwork Configuration:');
  console.log(`- Target: PREPROD`);
  console.log(`- Indexer: ${indexer}`);
  console.log(`- Node: ${node}`);

  setNetworkId(NetworkId.TestNet);
  console.log(`- SDK NetworkId enum used: TestNet`);

  try {
    const wallet = await WalletBuilder.buildFromSeed(
      indexer,
      indexerWS,
      proofServer,
      node,
      seedHex,
      getZswapNetworkId(),
      'info'
    );

    wallet.start();
    const state = await firstValueFrom(wallet.state());

    console.log('\nAddress Generation Result:');
    console.log(`Address: ${state.address}`);
    
    const prefix = state.address.split('1')[0];
    console.log(`Address prefix: ${prefix}`);
    console.log(`Address type: Shielded (tNight/Dust)`);
    console.log(`Network valid for Preprod Faucet? NO. Faucet requires an Unshielded (Cardano-side) address (addr_test1...).`);
    
    console.log('\nBalances:');
    console.log(JSON.stringify(state.balances, null, 2));

    await wallet.close();
  } catch (err) {
    console.error('\n❌ Wallet generation failed:');
    console.error(err.message);
  }
}

audit().catch(console.error);
