export interface Config {
  indexer: string;
  indexerWS: string;
  node: string;
  proofServer: string;
}

export const NetworkId = 'testnet'; // or 'standalone'

export const contractConfig = {
  privateStateStoreName: 'eligibility-private-state',
  zkConfigPath: '/zkir/medical-eligibility-verification.zkir',
};

// Default Preprod config for browser
export const currentConfig: Config = {
  indexer: process.env.NEXT_PUBLIC_INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWS: process.env.NEXT_PUBLIC_INDEXER_WS_URL || 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  node: process.env.NEXT_PUBLIC_NODE_URL || 'https://rpc.preprod.midnight.network',
  proofServer: process.env.NEXT_PUBLIC_PROOF_SERVER_URL || 'http://127.0.0.1:6300',
};
