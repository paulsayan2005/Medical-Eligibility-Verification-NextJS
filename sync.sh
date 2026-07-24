#!/bin/bash
# sync.sh — sync Windows project files to WSL native path

PROJECT="/home/sayan/midnight-projects/medical-eligibility-verification"
WINPROJECT="/mnt/e/Medical Eligibility Verification"

echo "Syncing files from Windows path to WSL native..."

# Contract source
cp "${WINPROJECT}/boilerplate/contract/src/witnesses.ts" "${PROJECT}/boilerplate/contract/src/witnesses.ts"
cp "${WINPROJECT}/boilerplate/contract/src/index.ts" "${PROJECT}/boilerplate/contract/src/index.ts"
cp "${WINPROJECT}/boilerplate/contract/src/medical-eligibility-verification.compact" "${PROJECT}/boilerplate/contract/src/medical-eligibility-verification.compact"

# CLI source
cp "${WINPROJECT}/boilerplate/contract-cli/src/common-types.ts" "${PROJECT}/boilerplate/contract-cli/src/common-types.ts"
cp "${WINPROJECT}/boilerplate/contract-cli/src/config.ts" "${PROJECT}/boilerplate/contract-cli/src/config.ts"
cp "${WINPROJECT}/boilerplate/contract-cli/src/api.ts" "${PROJECT}/boilerplate/contract-cli/src/api.ts"
cp "${WINPROJECT}/boilerplate/contract-cli/src/cli.ts" "${PROJECT}/boilerplate/contract-cli/src/cli.ts"
cp "${WINPROJECT}/boilerplate/contract-cli/package.json" "${PROJECT}/boilerplate/contract-cli/package.json"

# Tests
mkdir -p "${PROJECT}/boilerplate/contract-cli/src/test"
cp "${WINPROJECT}/boilerplate/contract-cli/src/test/eligibility.test.ts" "${PROJECT}/boilerplate/contract-cli/src/test/eligibility.test.ts"

# Root
cp "${WINPROJECT}/package.json" "${PROJECT}/package.json"

echo "Done! Files in contract/src:"
ls "${PROJECT}/boilerplate/contract/src/"
