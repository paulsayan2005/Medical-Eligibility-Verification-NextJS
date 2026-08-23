import { pino } from 'pino';
import { createEligibilityPrivateState, hashPolicyId } from '@midnight-ntwrk/contract';
import {
  buildWalletAndWaitForFunds,
  configureProviders,
  deployEligibilityContract,
  randomBytes,
  setLogger,
} from './api.js';
import { PreprodConfig } from './config.js';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import fs from 'node:fs';

const logger = pino({ level: 'info' });
setLogger(logger);

async function main() {
  const config = new PreprodConfig();

  console.log('🔧 Using Preprod network config');
  
  // Try to load seed from .env or generated
  let seed = process.env.WALLET_SEED;
  if (!seed) {
      if (fs.existsSync('.env')) {
          const env = fs.readFileSync('.env', 'utf-8');
          const match = env.match(/WALLET_SEED=(.*)/);
          if (match) seed = match[1].trim();
      }
  }
  
  if (!seed) {
    seed = toHex(randomBytes(32));
    fs.writeFileSync('.env', `WALLET_SEED=${seed}\n`);
    console.log(`🔑 Generated new wallet seed and saved to .env`);
  } else {
    console.log(`🔑 Using existing wallet seed from .env`);
  }

  console.log(`Connecting to Preprod network...`);
  const wallet = await buildWalletAndWaitForFunds(config, seed);

  const providers = await configureProviders(wallet, config);

  console.log('⏳ Deploying contract...');
  const age = 30; // dummy data for deployment
  const policyId = "test-policy-123";
  const privateState = createEligibilityPrivateState(age, hashPolicyId(policyId));
  
  try {
    const deployed = await deployEligibilityContract(providers, privateState);
    const contractAddress = deployed.deployTxData.public.contractAddress as string;
    console.log(`\n✅ Contract deployed successfully on Preprod!`);
    console.log(`📬 Contract address: ${contractAddress}`);
    fs.writeFileSync('deployed-address.txt', contractAddress);
  } catch (err) {
    console.error(`\n❌ Deploy failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  
  process.exit(0);
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
