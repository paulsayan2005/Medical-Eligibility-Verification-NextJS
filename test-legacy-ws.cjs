const WebSocket = require('ws');
const ws = new WebSocket('wss://indexer.preprod.midnight.network/api/v4/graphql/ws', 'graphql-ws');
ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'connection_init', payload: {} }));
});
ws.on('message', (data) => {
  console.log('Received:', data.toString());
  ws.close();
});
ws.on('error', (err) => console.error('Error:', err));
ws.on('close', (code, reason) => console.log('Closed:', code, reason.toString()));
