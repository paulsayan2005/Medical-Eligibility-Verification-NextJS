#!/usr/bin/env bash

COMPACT_DIR="$HOME/.compact/versions/0.31.1/x86_64-unknown-linux-musl"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH="$COMPACT_DIR:$PATH"

PROJECT="/mnt/e/Medical Eligibility Verification"
cd "$PROJECT"

echo "==== 1. CONTRACT COMPILE ===="
npm run build -w boilerplate/contract 2>&1
COMPILE_EXIT=$?
echo "Contract compile EXIT: $COMPILE_EXIT"

echo ""
echo "==== 2. TESTS ===="
npm run test -w boilerplate/contract-cli 2>&1
TEST_EXIT=$?
echo "Tests EXIT: $TEST_EXIT"

echo ""
echo "==== 3. TYPECHECK CLI ===="
npm run typecheck -w boilerplate/contract-cli 2>&1
TYPECHECK_EXIT=$?
echo "Typecheck EXIT: $TYPECHECK_EXIT"

echo ""
echo "==== 4. FRONTEND BUILD ===="
npm run build -w boilerplate/frontend 2>&1
FRONTEND_EXIT=$?
echo "Frontend build EXIT: $FRONTEND_EXIT"

echo ""
echo "==== SUMMARY ===="
echo "Contract compile: $COMPILE_EXIT"
echo "Tests: $TEST_EXIT"
echo "Typecheck: $TYPECHECK_EXIT"
echo "Frontend build: $FRONTEND_EXIT"
