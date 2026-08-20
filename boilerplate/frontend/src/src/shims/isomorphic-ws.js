// Browser shim for isomorphic-ws
// The Midnight indexer provider uses \import { WebSocket } from 'isomorphic-ws'\`n// which fails in webpack browser bundles. This shim provides the named export.

/* global WebSocket */
export { WebSocket };
export default WebSocket;
