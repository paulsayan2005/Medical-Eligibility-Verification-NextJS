import { ShieldedAddress, MidnightBech32m } from '@midnight-ntwrk/wallet-sdk-address-format';

const testAddress = 'mn_shield-addr_test1r2cczeya85qjxusyxqr3nmdzfvkpe7wmvl6qf57vmyl6t99r6ulqxqzyvkjd3d2pzn6xll84jwlgcelcpalunnsjrxjnuqzmrpesrarlwvt2swwx';
try {
  const parsed = MidnightBech32m.parse(testAddress);
  const decoded = ShieldedAddress.codec.decode('test', parsed);
  const preprodAddress = ShieldedAddress.codec.encode('preprod', decoded).asString();
  console.log('Preprod address:', preprodAddress);
} catch (e) {
  console.error(e);
}
