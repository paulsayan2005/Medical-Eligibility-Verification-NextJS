#!/usr/bin/env bash
source $HOME/.nvm/nvm.sh
echo "=== wallet.d.ts exports ==="
cat /mnt/e/Medical\ Eligibility\ Verification/node_modules/@midnight-ntwrk/wallet-api/dist/wallet.d.ts 2>/dev/null
echo ""
echo "=== types/index.d.ts exports ==="
cat /mnt/e/Medical\ Eligibility\ Verification/node_modules/@midnight-ntwrk/wallet-api/dist/types/index.d.ts 2>/dev/null
