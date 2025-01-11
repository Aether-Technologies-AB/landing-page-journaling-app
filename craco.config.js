module.exports = {
  devServer: {
    client: {
      webSocketURL: {
        hostname: process.env.WDS_SOCKET_HOST,
        pathname: process.env.WDS_SOCKET_PATH,
        port: process.env.WDS_SOCKET_PORT,
      },
    },
  },
};
