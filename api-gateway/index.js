const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Define routes
const services = {
  '/products': 'http://product-service:3001',
  '/orders': 'http://order-service:3002',
  '/customers': 'http://customer-service:3003'
};

// Set up proxies
for (const [path, target] of Object.entries(services)) {
  app.use(path, createProxyMiddleware({ target, changeOrigin: true }));
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});