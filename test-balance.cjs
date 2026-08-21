const WebSocket = require('ws');
const ws = new WebSocket('wss://indexer.preprod.midnight.network/api/v4/graphql/ws', 'graphql-transport-ws');

ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'connection_init', payload: {} }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.type === 'connection_ack') {
    ws.send(JSON.stringify({
      id: '1',
      type: 'subscribe',
      payload: {
        query: `query { tokens { nodes { id } } }`
      }
    }));
  } else {
    console.log(JSON.stringify(msg, null, 2));
    ws.close();
  }
});
