// Browser shim for isomorphic-ws
// Named export fix for webpack browser bundles

export const WebSocket = globalThis.WebSocket;
export default globalThis.WebSocket;
