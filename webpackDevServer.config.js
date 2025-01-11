module.exports = {
  client: {
    webSocketURL: {
      hostname: 'localhost',
      pathname: '/ws',
      port: 3000,
      protocol: 'ws',
    },
  },
  webSocketServer: 'ws',
  hot: true,
  compress: true,
  static: {
    publicPath: '/',
  },
  historyApiFallback: true,
};
