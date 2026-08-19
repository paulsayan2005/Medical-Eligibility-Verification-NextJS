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

// Clean dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// Run tsc
execSync('tsc --project tsconfig.build.json', { cwd: __dirname, stdio: 'inherit' });
console.log('✅ Contract-CLI build completed');
