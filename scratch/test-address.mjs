import * as sdk from '@midnight-ntwrk/wallet-sdk';
console.log(Object.keys(sdk).filter(k => k.toLowerCase().includes('address') || k.toLowerCase().includes('encode') || k.toLowerCase().includes('bech32')));
