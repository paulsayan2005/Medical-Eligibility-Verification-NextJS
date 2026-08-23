#!/usr/bin/env bash
set -e

COMPACT_DIR="$HOME/.compact/versions/0.31.1/x86_64-unknown-linux-musl"
export PATH="$COMPACT_DIR:$PATH"

echo "==== ENVIRONMENT CHECKS ===="
echo "Node version: $(node --version 2>&1)"
echo "npm version: $(npm --version 2>&1)"
echo "npm path: $(which npm 2>&1)"
echo "compactc location: $(which compactc 2>&1 || echo 'NOT FOUND')"
echo "compactc.bin location: $COMPACT_DIR/compactc.bin"
ls -la "$COMPACT_DIR" 2>/dev/null || echo "Compact dir not found"

echo ""
echo "==== CONTRACT SOURCE CHECK ===="
find boilerplate/contract/src -name "*.compact" 2>/dev/null
ls boilerplate/contract/src/managed/ 2>/dev/null || echo "managed/ directory empty or missing"

echo ""
echo "==== GIT LOG (last 15 commits) ===="
git log --oneline -15

echo ""
echo "==== GIT STATUS ===="
git status --short

echo ""
echo "==== SECRET CHECKS ===="
git grep -l "seedPhrase\|mnemonic\|privateKey\|PRIVATE_KEY\|SEED" -- ":(exclude)node_modules" 2>/dev/null | head -n 20 || echo "No secrets found"
ls boilerplate/frontend/.env 2>/dev/null && echo "WARNING: .env committed!" || echo ".env not committed (good)"
ls .midnight-state.json 2>/dev/null && echo "WARNING: .midnight-state.json committed!" || echo ".midnight-state.json not committed (good)"

echo ""
echo "==== .ENV.EXAMPLE CHECK ===="
cat boilerplate/frontend/.env.example 2>/dev/null || echo "MISSING .env.example"

echo ""
echo "==== CI/CD CHECK ===="
cat .github/workflows/ci.yml
