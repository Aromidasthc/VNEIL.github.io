/**
 * MODULE: VNEIL-GENESIS Demo Server
 * 
 * Purpose: Minimal Express server for demonstrating VNEIL-GENESIS setup
 * 
 * Assumptions:
 * - Express and path modules are available
 * - PORT environment variable (if set) is a valid port number or string representation
 * - public/ directory exists in the same directory as this file
 * 
 * Invariants:
 * - Server listens on validated PORT (default 3000)
 * - All routes return proper HTTP responses
 * - Errors are logged to stderr and exit with non-zero code
 * 
 * Failure Modes:
 * - Invalid PORT: falls back to 3000 with warning
 * - Server listen failure: logs error and exits with code 1
 * - Missing public/ directory: Express serves 404 (handled by framework)
 * 
 * Example:
 *   node index.js
 *   PORT=8080 node index.js
 */

const express = require('express');
const path = require('path');

const app = express();

// Fail-fast: Validate and sanitize PORT
function getPort() {
  const envPort = process.env.PORT;
  
  if (!envPort) {
    return 3000; // Default port
  }
  
  const port = parseInt(envPort, 10);
  
  // Validate port is a valid number and within valid range
  if (isNaN(port) || port < 1 || port > 65535) {
    console.warn(`Warning: Invalid PORT "${envPort}", using default 3000`);
    return 3000;
  }
  
  return port;
}

const PORT = getPort();

// Security middleware: CSP headers
app.use((req, res, next) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "font-src 'self'; " +
    "connect-src 'self';"
  );
  
  // Other security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});

// Serve the VNEIL OS futuristic website (main site)
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to legacy landing page for /legacy route
app.use('/legacy', express.static(path.join(__dirname, 'WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', demo: 'vneil-genesis', site: 'vertyxnexus.pl' });
});

// Error handling for server startup
const server = app.listen(PORT, () => {
  console.log(`✅ VNEIL OS running on http://localhost:${PORT}`);
  console.log(`   Legacy site available at http://localhost:${PORT}/legacy`);
});
// Only start server if not running in serverless environment (like Vercel)
if (require.main === module) {
  // Error handling for server startup
  const server = app.listen(PORT, () => {
    console.log(`✅ VERTYX NEXUS site running on http://localhost:${PORT}`);
    console.log(`   Demo available at http://localhost:${PORT}/demo`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Error: Port ${PORT} is already in use`);
    } else if (err.code === 'EACCES') {
      console.error(`Error: Permission denied for port ${PORT} (try port >= 1024)`);
    } else {
      console.error(`Server error: ${err.message}`);
    }
    process.exit(1);
  });
}

// Export app for Vercel serverless (default export)
module.exports = app;

// Export getPort for testing (named export compatibility)
module.exports.getPort = getPort;
