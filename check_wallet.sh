#!/usr/bin/env bash
source $HOME/.nvm/nvm.sh
echo "=== wallet-api type exports ==="
grep "export" /mnt/e/Medical\ Eligibility\ Verification/node_modules/@midnight-ntwrk/wallet-api/dist/index.d.ts 2>/dev/null | head -30 || echo "index.d.ts not found"
find /mnt/e/Medical\ Eligibility\ Verification/node_modules/@midnight-ntwrk/wallet-api -name "*.d.ts" 2>/dev/null | head -10
echo ""
echo "=== wallet pkg types ==="
cat /mnt/e/Medical\ Eligibility\ Verification/node_modules/@midnight-ntwrk/wallet-api/package.json | grep -E '"types|typings|main"'
