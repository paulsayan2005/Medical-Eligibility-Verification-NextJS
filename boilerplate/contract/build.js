import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');
const managedSrcDir = path.join(srcDir, 'managed');
const managedDistDir = path.join(distDir, 'managed');

// Clean dist and tsbuildinfo
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
const buildInfo1 = path.join(__dirname, 'tsconfig.build.tsbuildinfo');
const buildInfo2 = path.join(__dirname, 'tsconfig.tsbuildinfo');
if (fs.existsSync(buildInfo1)) fs.rmSync(buildInfo1, { force: true });
if (fs.existsSync(buildInfo2)) fs.rmSync(buildInfo2, { force: true });
fs.mkdirSync(distDir, { recursive: true });

// Run tsc
execSync('npx tsc --project tsconfig.build.json', { cwd: __dirname, stdio: 'inherit' });

// Copy managed
if (fs.existsSync(managedSrcDir)) {
  fs.cpSync(managedSrcDir, managedDistDir, { recursive: true });
}

// Copy .compact files
for (const file of fs.readdirSync(srcDir)) {
  if (file.endsWith('.compact')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
  }
}

// Clean checkRuntimeVersion from generated files in dist/managed
function cleanRuntimeVersion(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      cleanRuntimeVersion(fullPath);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.cjs') || entry.name.endsWith('.mjs')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('checkRuntimeVersion')) {
        content = content.replace(/.*checkRuntimeVersion.*/g, '');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}
cleanRuntimeVersion(managedDistDir);
console.log('✅ Contract build completed');
