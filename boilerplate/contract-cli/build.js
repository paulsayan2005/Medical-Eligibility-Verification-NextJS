import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Build contract first
try {
  execSync('npm run build -w @midnight-ntwrk/contract', { cwd: __dirname, stdio: 'inherit' });
} catch (e) {
  // Ignore or continue
}

// Clean dist and tsbuildinfo
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
const buildInfo1 = path.join(__dirname, 'tsconfig.build.tsbuildinfo');
const buildInfo2 = path.join(__dirname, 'tsconfig.tsbuildinfo');
if (fs.existsSync(buildInfo1)) fs.rmSync(buildInfo1, { force: true });
if (fs.existsSync(buildInfo2)) fs.rmSync(buildInfo2, { force: true });

// Run tsc
execSync('npx tsc --project tsconfig.build.json', { cwd: __dirname, stdio: 'inherit' });
console.log('✅ Contract-CLI build completed');
