import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const originalReadlink = fs.readlink;
fs.readlink = function(p, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  originalReadlink(p, options, (err, linkString) => {
    if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'EPERM')) {
      err.code = 'EINVAL'; // Make webpack treat it as "not a symlink"
    }
    callback(err, linkString);
  });
};

const originalReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function(p, options) {
  try {
    return originalReadlinkSync(p, options);
  } catch (err) {
    if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'EPERM')) {
      const newErr = new Error(`EINVAL: invalid argument, readlink '${p}'`);
      newErr.code = 'EINVAL';
      throw newErr;
    }
    throw err;
  }
};

const originalPromisesReadlink = fs.promises.readlink;
fs.promises.readlink = async function(p, options) {
  try {
    return await originalPromisesReadlink(p, options);
  } catch (err) {
    if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'EPERM')) {
      const newErr = new Error(`EINVAL: invalid argument, readlink '${p}'`);
      newErr.code = 'EINVAL';
      throw newErr;
    }
    throw err;
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@midnight-ntwrk/contract'],
  webpack: (config, { isServer, dev }) => {
    config.resolve.symlinks = false;

    // Alias @midnight-ntwrk/contract to its TypeScript source
    // (the .tgz package has no compiled dist/ folder)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@midnight-ntwrk/contract': path.resolve(__dirname, '../../contract/src/index.ts'),
    };

    // Allow .js imports to resolve .ts files (TS ESM convention)
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.cjs': ['.cts', '.cjs'],
      '.mjs': ['.mts', '.mjs'],
    };
    
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        os: false,
        stream: false,
        buffer: false,
      };
    }

    return config;
  },
};

export default nextConfig;
