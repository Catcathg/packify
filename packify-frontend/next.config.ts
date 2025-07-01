/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'standalone',
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
}

module.exports = nextConfig