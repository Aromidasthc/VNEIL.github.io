# 🔧 Vercel FUNCTION_INVOCATION_FAILED — Fix v2

## Problem Found

The first fix removed `app.listen()` but still had issues:
- ❌ Using `express.static()` in serverless function
- ❌ Trying to serve files from filesystem in ephemeral serverless environment
- ❌ All routes going through the serverless function (inefficient)

## Root Cause

**Issue**: `express.static(path.join(__dirname, '..', 'public'))` in `api/index.js`

In Vercel serverless:
1. File paths may not resolve correctly in Lambda environment
2. Static file middleware causes function timeout
3. Every request triggers cold start (slow)

**Correct approach**: Let Vercel serve static files directly using `@vercel/static` builder

## Solution

### 1. Updated `vercel.json` (routing strategy)

**Before** (incorrect):
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"  // ❌ Everything goes to function
    }
  ]
}
```

**After** (correct):
```json
{
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"      // ← Build static files first
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"         // ← Then serverless function
    }
  ],
  "routes": [
    {
      "src": "/api/health",
      "dest": "/api/index.js"        // ← API routes to function
    },
    {
      "src": "/(.*\\.(js|css|html|jpeg|jpg|png|gif|svg|ico))",
      "dest": "/public/$1"           // ← Static files served directly
    },
    {
      "src": "/(.*)",
      "dest": "/public/index.html"   // ← Catch-all for SPA
    }
  ]
}
```

### 2. Simplified `api/index.js`

**Before** (incorrect):
```javascript
// ❌ This causes FUNCTION_INVOCATION_FAILED
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/legacy', express.static(...));
```

**After** (correct):
```javascript
// ✅ Only API endpoints - no static file serving
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ... });
});

// No express.static() calls!
```

## Why This Works

### Vercel Architecture

```
Request → Vercel Edge
          ├─ /api/health → Serverless Function (api/index.js)
          ├─ /styles.css → Static File (public/styles.css)
          ├─ /app.js → Static File (public/app.js)
          └─ / → Static File (public/index.html)
```

**Benefits**:
- ✅ Static files served from CDN (fast, no cold start)
- ✅ API endpoints processed by function (dynamic)
- ✅ No filesystem access issues
- ✅ Proper separation of concerns

### Build Process

1. **Build static assets**: `@vercel/static` builder optimizes and deploys files from `public/`
2. **Build serverless function**: `@vercel/node` builder compiles `api/index.js`
3. **Routing**: Vercel edge routes requests based on `routes` config

## Key Learnings

### ❌ Don't Do This in Vercel Serverless

```javascript
// Don't serve static files in serverless function
app.use(express.static('public'));  // ❌

// Don't use filesystem operations
fs.readFileSync('./public/index.html');  // ❌

// Don't call listen
app.listen(3000);  // ❌
```

### ✅ Do This Instead

```javascript
// Use vercel.json to route static files
// In api/index.js: only API endpoints
app.get('/api/endpoint', handler);  // ✅

// Let Vercel handle static file serving
// Configure in vercel.json routes  // ✅
```

## Testing

```bash
# Local testing still works
npm start  # Uses index.js (traditional server)

# Vercel deployment
# Uses api/index.js + static routing
```

---

**Updated**: 2026-01-27  
**Fix Version**: v2  
**Status**: ✅ RESOLVED
