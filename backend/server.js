const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripe');

const app = express();

// Debug config
console.log('MongoDB URI:', config.mongoUri ? `${config.mongoUri.substring(0, 20)}...` : 'Not set');
console.log('Configuration loaded:', {
  mongoUri: config.mongoUri ? 'Set (length: ' + config.mongoUri.length + ')' : 'Not set',
  stripeKey: config.stripeSecretKey ? 'Set' : 'Not set',
  stripeWebhook: config.stripeWebhookSecret ? 'Set' : 'Not set',
  clientUrl: config.clientUrl,
  port: config.port,
  environment: config.nodeEnv
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers
  });
  next();
});

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
mongoose.set('debug', true); // Enable mongoose debug mode

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  heartbeatFrequencyMS: 1000,
  retryWrites: true,
  w: 'majority'
};

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, mongooseOptions);
    console.log('MongoDB Connected:', conn.connection.host);
    
    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName
    });
    
    // Don't exit the process, just log the error
    return null;
  }
};

// Connect to MongoDB
connectDB();

// MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Test MongoDB connection route
app.get('/api/test-db', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected. Current state: ' + mongoose.connection.readyState);
    }
    
    // Check if we can list collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ 
      status: 'ok',
      dbState: mongoose.connection.readyState,
      collections: collections.map(c => c.name),
      connectionString: {
        set: !!config.mongoUri,
        length: config.mongoUri ? config.mongoUri.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message,
      dbState: mongoose.connection.readyState,
      connectionString: {
        set: !!config.mongoUri,
        length: config.mongoUri ? config.mongoUri.length : 0
      }
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', stripeRoutes);

// Debug route to test server
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    mongo: {
      state: mongoose.connection.readyState,
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host
    },
    config: {
      mongoSet: !!config.mongoUri,
      port: config.port,
      env: process.env.NODE_ENV
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: config.nodeEnv === 'development' ? err.message : undefined
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log('Environment:', config.nodeEnv);
  console.log('Available routes:');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/create-checkout-session');
  console.log('- GET /api/health');
  console.log('- GET /api/test-db');
});
