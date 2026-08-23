#!/usr/bin/env bash
set -e

COMPACT_DIR="$HOME/.compact/versions/0.31.1/x86_64-unknown-linux-musl"

# Load NVM so node is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

export PATH="$COMPACT_DIR:$PATH"

PROJECT="/mnt/e/Medical Eligibility Verification"
cd "$PROJECT"

echo "==== ENVIRONMENT ===="
echo "node: $(node --version)"
echo "npm: $(npm --version)"
echo "npm path: $(which npm)"
echo "compactc: $(which compactc 2>/dev/null || echo NOT FOUND)"

echo ""
echo "==== REINSTALL DEPS (WSL native binaries) ===="
# Remove Windows-installed rolldown binaries and reinstall for Linux
rm -rf node_modules/rolldown/dist/shared/*binding*.node 2>/dev/null || true
npm install 2>&1

echo ""
echo "==== 1. COMPILE CONTRACT ===="
npm run build -w boilerplate/contract 2>&1
echo "EXIT: $?"

echo ""
echo "==== 2. RUN TESTS ===="
npm run test -w boilerplate/contract-cli 2>&1
echo "EXIT: $?"

echo ""
echo "==== 3. TYPECHECK CLI ===="
npm run typecheck -w boilerplate/contract-cli 2>&1
echo "EXIT: $?"

echo ""
echo "==== 4. BUILD FRONTEND ===="
npm run build -w boilerplate/frontend 2>&1
echo "EXIT: $?"
