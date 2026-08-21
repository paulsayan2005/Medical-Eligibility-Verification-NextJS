/**
 * Direct deployment script — bypasses the interactive CLI.
 * Deploys the Medical Eligibility Verification contract to Preprod.
 */
import 'dotenv/config';
import { pino } from 'pino';
import { mnemonicToSeedSync } from 'bip39';
import { createEligibilityPrivateState, hashPolicyId } from '@midnight-ntwrk/contract';
import {
  buildWalletAndWaitForFunds,
  configureProviders,
  deployEligibilityContract,
  setLogger,
} from './api.js';
import { PreprodConfig } from './config.js';

const logger = pino({ level: 'info' });
setLogger(logger);

const MNEMONIC = 'credit collect practice october miracle ripple winter giggle sort couch hire quick autumn wire tomato thought traffic royal essence coin pencil reject orphan element';

async function deploy() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   🏥  Medical Eligibility Verification               ║');
  console.log('║   Auto-Deploy to Midnight Preprod                    ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');

  const config = new PreprodConfig();
  console.log('🔧 Network config:');
  console.log(`   Indexer:      ${config.indexer}`);
  console.log(`   Node:         ${config.node}`);
  console.log(`   Proof Server: ${config.proofServer}`);
  console.log('');

  // Derive seed from mnemonic
  const seed = Buffer.from(mnemonicToSeedSync(MNEMONIC).slice(0, 32)).toString('hex');
  console.log('🔑 Seed derived from 1AM wallet mnemonic');

  let wallet;
  try {
    console.log('⏳ Connecting to Preprod network and initializing wallet...');
    wallet = await buildWalletAndWaitForFunds(config, seed);
    console.log('✅ Wallet initialized successfully');
  } catch (err) {
    console.error('❌ Wallet initialization failed:', err instanceof Error ? err.message : String(err));
    console.error(err);
    process.exit(1);
  }

  const providers = await configureProviders(seed, config, wallet?.shieldedInstance);

  // Use dummy private state for deployment (age=0, policyId='deploy')
  const privateState = createEligibilityPrivateState(0, hashPolicyId('deploy'));

  console.log('');
  console.log('⏳ Deploying contract to Preprod...');
  console.log('   (This may take 1-3 minutes for proof generation and tx submission)');

  try {
    const deployed = await deployEligibilityContract(providers, privateState);
    const contractAddress = deployed.deployTxData.public.contractAddress;

    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║  ✅  CONTRACT DEPLOYED SUCCESSFULLY!                 ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`CONTRACT_ADDRESS=${contractAddress}`);
    console.log('');
    console.log('📋 Copy the contract address above and update README.md');

    process.exit(0);
  } catch (err) {
    console.error('❌ Deployment failed:', err instanceof Error ? err.message : String(err));
    console.error(err);
    process.exit(1);
  }
}

deploy();
