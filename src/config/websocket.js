const config = {
  development: {
    wsUrl: 'ws://localhost:3000/ws'
  },
  production: {
    wsUrl: `wss://${process.env.REACT_APP_HEROKU_APP_NAME || 'your-app-name'}.herokuapp.com/ws`
  }
};

export default config[process.env.NODE_ENV || 'development'];
