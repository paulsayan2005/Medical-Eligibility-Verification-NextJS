const WebSocket = require('ws');
const ws = new WebSocket('wss://indexer.preprod.midnight.network/api/v4/graphql/ws', 'graphql-transport-ws');

console.log('Connecting...');

ws.on('open', () => {
  console.log('Connected!');
  ws.close();
});

ws.on('error', (err) => {
  console.error('Error:', err.message);
});

ws.on('close', () => {
  console.log('Connection closed');
});
