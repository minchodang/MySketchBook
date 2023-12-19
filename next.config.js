/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        unsplash_access_key: process.env.unsplash_access_key,
        unsplash_secret_key: process.env.unsplash_secret_key,
    },
    images: {
        remotePatterns: [{ hostname: 'images.unsplash.com' }],
        minimumCacheTTL: 60,
    },
    // rewrites: () => {
    //     return [
    //         {
    //             source: '/photo/:path*',
    //             destination: 'https://api.unsplash.com/:path*',
    //         },
    //     ];
    // },
};

module.exports = nextConfig;
