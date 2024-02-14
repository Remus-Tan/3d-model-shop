/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: () => [
      {
        source: '/user/profile/:id*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ],
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
