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
