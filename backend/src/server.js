const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const softwareRoutes = require('./routes/software');
const requestRoutes = require('./routes/requests');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/requests', requestRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to User Access Management System' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database sync and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await sequelize.sync();
    console.log('Database synced.');

    // Create admin user if not exists
    const User = require('./models/User');
    const adminExists = await User.findOne({
      where: { email: 'admin@example.com' }
    });

    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 