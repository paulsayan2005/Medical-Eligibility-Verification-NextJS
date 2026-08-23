#!/usr/bin/env bash

COMPACT_DIR="$HOME/.compact/versions/0.31.1/x86_64-unknown-linux-musl"
export PATH="$COMPACT_DIR:$PATH"

PROJECT="/mnt/e/Medical Eligibility Verification"
cd "$PROJECT"

echo "==== NODE / NPM CHECK ===="
node_path=$(which node 2>/dev/null)
if [ -z "$node_path" ]; then
  # Try NVM locations
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  node_path=$(which node 2>/dev/null)
fi

if [ -z "$node_path" ]; then
  # Try n or fnm
  export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:/usr/local/bin:$PATH"
  node_path=$(which node 2>/dev/null)
fi

echo "node: $node_path"
node --version 2>&1 || echo "ERROR: node not found in WSL"
npm --version 2>&1

echo ""
echo "==== 1. COMPILE CONTRACT ===="
cd "$PROJECT"
npm run build -w boilerplate/contract 2>&1
echo "Contract build exit code: $?"

echo ""
echo "==== 2. RUN TESTS ===="
npm run test -w boilerplate/contract-cli 2>&1
echo "Test exit code: $?"

echo ""
echo "==== 3. TYPECHECK CLI ===="
npm run typecheck -w boilerplate/contract-cli 2>&1
echo "Typecheck exit code: $?"

echo ""
echo "==== 4. BUILD FRONTEND ===="
npm run build -w boilerplate/frontend 2>&1
echo "Frontend build exit code: $?"
