import * as sdk from '@midnight-ntwrk/wallet-sdk';
console.log(Object.keys(sdk).filter(k => k.includes('Secret') || k.includes('Builder') || k.includes('Facade')));
