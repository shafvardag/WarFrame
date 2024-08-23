// next.config.mjs

export default {
  trailingSlash: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/sitemap.xml',
  //       destination: '/api/sitemap',
  //     },
  //   ];
  // },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: `/_next/static/videos/`,
          outputPath: `${isServer ? '../' : ''}static/videos/`,
          name: '[name]-[hash].[ext]',
        },
      },
    });

    return config;
  },
  images: {
    domains: ['admin.snowdreamstudios.com'],
  },
};