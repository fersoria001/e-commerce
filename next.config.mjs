/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*.googleusercontent.com',
            port: '',
            pathname: '/a/**',
          },
          {
            protocol: 'https',
            hostname: '*.gravatar.com',
            port: '',
            pathname: '/avatar/**',
          },
          {
            protocol: 'https',
            hostname: 'files.stripe.com',
            port: '',
            pathname: '/links/**',
          },
          {
            protocol: 'https',
            hostname: 'iili.io',
            port: '',
            pathname: '/*',
          },
        ],
      },
};


export default nextConfig;
