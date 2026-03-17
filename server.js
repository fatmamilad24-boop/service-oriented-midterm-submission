// backend/user-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // You need to create this

const app = express();

// ============ MIDDLEWARE ============
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============ DATABASE CONNECTION ============
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ User Service DB connected successfully"))
.catch(err => {
    console.error("❌ User Service DB connection error:", err);
    process.exit(1); // Exit if database connection fails
});

// ============ ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // You'll create this

// Health check endpoint (important for API Gateway)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        service: 'user-service',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: "User Service is running...",
        version: "1.0.0",
        endpoints: [
            "/api/auth/register - POST",
            "/api/auth/login - POST",
            "/api/users/profile - GET (protected)",
            "/health - GET"
        ]
    });
});

// ============ ERROR HANDLING ============

// 404 handler for routes not found
app.use((req, res, next) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate field value entered',
            field: Object.keys(err.keyPattern)[0]
        });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
    }
    
    // Default error
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`🚀 User Service running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 MongoDB: ${process.env.MONGO_URI}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = app; // For testing