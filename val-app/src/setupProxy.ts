import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express'; // Import the Express type

module.exports = function (app: Express) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000', // Your backend API's URL
      changeOrigin: true,
      // Add any other proxy options you might need
    })
  );
};
