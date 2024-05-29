/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    distDir: 'build',
    images: {
      domains: ['firebasestorage.googleapis.com'],
      remotePatterns: [{
        hostname: 'firebasestorage.googleapis.com',
        protocol: 'https',
        port: ''
      }]
    },
};

export default nextConfig;
