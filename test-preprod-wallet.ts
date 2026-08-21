import { WalletBuilder } from '@midnight-ntwrk/wallet';
import * as zswap from '@midnight-ntwrk/zswap';
const seed = 'd7dcb931d76c987ce22ccafa0e0618a516ecccb57fa52ca2d6e64052b9356bc5';
WalletBuilder.buildFromSeed('http://dummy', 'ws://dummy', 'http://dummy', 'http://dummy', seed, 'preprod' as unknown as zswap.NetworkId, 'info').then(w => console.log(w.state().value.address)).catch(e => console.error(e));
