const { setNetworkId, getNetworkId } = require('@midnight-ntwrk/midnight-js-network-id');
try {
  setNetworkId('preprod');
  console.log(getNetworkId());
} catch (e) {
  console.error(e.message);
}
