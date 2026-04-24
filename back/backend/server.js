require('dotenv').config();

const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const actionRoutes = require('./routes/actionRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const { testConnection } = require('./config/db');
const AppError = require('./utils/AppError');
const errorHandler = require('./utils/errorHandler');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Quality Manager API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/equipment', equipmentRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Smart Quality Manager API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
