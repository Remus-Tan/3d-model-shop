/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'img.clerk.com'
            }
        ]
    },
    transpilePackages: ['three'],
};

module.exports = nextConfig;
