/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    // jSquash/heic-to ship .wasm fetched at runtime; don't let webpack choke on them
    config.module.rules.push({ test: /\.wasm$/, type: 'asset/resource' });
    return config;
  },
  // These packages are ESM with WASM; transpile them for the client bundle
  transpilePackages: ['@jsquash/avif', 'heic-to'],
};
export default nextConfig;
