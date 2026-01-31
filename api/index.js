/**
 * MODULE: VNEIL-GENESIS Vercel Serverless Handler
 *
 * Purpose: API endpoints for Vercel deployment (static files served by Vercel directly)
 *
 * Assumptions:
 * - Running in Vercel serverless environment
 * - Static files (HTML/CSS/JS) served by Vercel's static file handler
 * - Security headers set globally in vercel.json
 *
 * Invariants:
 * - Exports handler function for Vercel
 * - No server.listen() calls (Vercel manages this)
 * - No express.static() (Vercel handles static files)
 *
 * Failure Modes:
 * - Missing dependencies: Vercel build will fail
 * - Invalid routes: Returns 404
 *
 * Example:
 *   Vercel automatically calls this for /api/* routes
 */

const express = require('express');
const app = express();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    demo: 'vneil-genesis',
    site: 'vertyxnexus.pl',
    timestamp: new Date().toISOString(),
  });
});

// Fallback for other API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
  });
});

// CRITICAL: For Vercel, export the app instead of calling listen()
// Static files are served by Vercel's static handler, not this function
// Security headers are configured globally in vercel.json
module.exports = app;
