#!/bin/bash

# Fix restaurant-service/package.json
cat > backend/restaurant-service/package.json << 'EOF'
{
  "name": "restaurant-service",
  "version": "1.0.0",
  "description": "Restaurant and Menu Management Service",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOF

# Fix order-service/package.json
cat > backend/order-service/package.json << 'EOF'
{
  "name": "order-service",
  "version": "1.0.0",
  "description": "Order Processing Service",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOF

# Fix delivery-service/package.json
cat > backend/delivery-service/package.json << 'EOF'
{
  "name": "delivery-service",
  "version": "1.0.0",
  "description": "Delivery Tracking Service",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOF

# Fix frontend/react-app/package.json
cat > frontend/react-app/package.json << 'EOF'
{
  "name": "react-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.4.0",
    "react-router-dom": "^6.11.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
EOF

# Fix api-gateway/server.js
cat > backend/api-gateway/server.js << 'EOF'
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Service routes
app.use("/api/auth", createProxyMiddleware({ 
    target: "http://localhost:3001", 
    changeOrigin: true
}));

app.use("/api/users", createProxyMiddleware({ 
    target: "http://localhost:3001", 
    changeOrigin: true
}));

app.use("/api/restaurants", createProxyMiddleware({ 
    target: "http://localhost:3002", 
    changeOrigin: true
}));

app.use("/api/orders", createProxyMiddleware({ 
    target: "http://localhost:3003", 
    changeOrigin: true
}));

app.use("/api/delivery", createProxyMiddleware({ 
    target: "http://localhost:3004", 
    changeOrigin: true
}));

// Health check
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        service: "api-gateway",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "API Gateway is running",
        services: {
            auth: "http://localhost:3001/api/auth",
            users: "http://localhost:3001/api/users",
            restaurants: "http://localhost:3002/api/restaurants",
            orders: "http://localhost:3003/api/orders",
            delivery: "http://localhost:3004/api/delivery"
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});
EOF

echo "✅ All files fixed!"