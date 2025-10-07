/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DISABLE_REACT_DEVTOOLS: 'true',
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable React DevTools in development to prevent semver errors
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      };
    }
    return config;
  },
};

module.exports = nextConfig;
