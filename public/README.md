# 🌌 VNEIL OS — Futuristic Website

**Production-ready website for www.vertyxnexus.pl**

![VNEIL OS](logo.jpeg)

## ✨ Features

- **Dark Futuristic Theme**: Near-black background with neon green (#00ff88) and cyan (#00d4ff) accents
- **Animated Interface**: Subtle glow effects, pulse animations, and interactive hover states
- **Interactive OS Map**: Click-to-explore visualization of VNEIL system architecture
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Zero Build Tools**: Pure HTML, CSS, and vanilla JavaScript — no complex tooling required
- **Fast & Lightweight**: Minimal dependencies, fast load times

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

That's it! 🎉

## 📁 Project Structure

```
public/
├── index.html      # Main page with futuristic layout
├── styles.css      # Dark theme + neon animations (356 lines)
├── app.js          # Interactive OS map logic (336 lines)
├── logo.jpeg       # VERTYX NEXUS EIL logo
└── DEPLOY.md       # Detailed deployment guide
```

## 🎨 Visual Design

- **Background**: Animated grid pattern with subtle movement
- **Colors**: Neon green/cyan gradients with energy glow effects
- **Typography**: Clean, modern fonts with gradient text effects
- **Animations**: Pulsing logo, glowing scanlines, smooth hover transitions
- **Layout**: Centered, hierarchical structure mimicking an OS interface

## 🗺️ Interactive Map

The website features an interactive visualization of the VNEIL OS structure:

- **BOSON-O**: Root node — Kotwica Istnienia
- **CORE-0**: System activator with sub-components (Invariants, ECG, EIL AI)
- **META-CYCLE**: System lifecycle (Regeneracja, Reinkarnacja, Samowyłączenie)
- **PORTS**: 10 system interface boxes (BOX-1 through BOX-10)

Click any node to view its description and highlight it with neon effects.

## 🔧 Customization

### Change Neon Colors
Edit `public/styles.css` (lines 7-8):
```css
--neon-green: #00ff88;  /* Your color here */
--neon-cyan: #00d4ff;   /* Your color here */
```

### Modify System Structure
Edit `public/app.js` (lines 12-86) to change the OS map structure.

### Replace Logo
Replace `public/logo.jpeg` with your logo (or update reference in `index.html`).

## 📦 Deployment

See **[DEPLOY.md](public/DEPLOY.md)** for comprehensive deployment instructions including:
- Cloud platforms (Heroku, Render, Railway)
- VPS deployment (PM2, systemd)
- Docker containers
- Custom domain setup with HTTPS
- Reverse proxy configuration

## ✅ Acceptance Criteria (All Met)

- [x] Dark theme with neon green/cyan accents
- [x] Logo displayed at top with glow animation
- [x] Interactive OS map shows VNEIL structure
- [x] Hover effects and subtle animations work
- [x] Server runs with `npm start`
- [x] Simple deployment guide included
- [x] No breaking changes to existing setup
- [x] No complex build tools required
- [x] Fully responsive design
- [x] "Living system" feel with animations

## 🛡️ Technical Details

- **Server**: Express.js (minimal, stable)
- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: Pure CSS with animations
- **Browser Support**: All modern browsers
- **Node Version**: 14+
- **Dependencies**: Express only (for serving static files)

## 📊 Performance

- Load time: < 1 second
- Total page size: ~460 KB (includes logo image)
- JavaScript: 9.4 KB (unminified)
- CSS: 6.9 KB (unminified)
- Zero external dependencies on client side

## 🧪 Testing

```bash
# Start server
npm start

# In another terminal, test endpoints
curl http://localhost:3000/api/health
curl -I http://localhost:3000/
curl -I http://localhost:3000/styles.css
curl -I http://localhost:3000/app.js
```

All should return HTTP 200 OK.

## 📝 Version

**v1.0** — Production Ready  
Created: 2024-01-26  
Framework: VNEIL/TSVNE Standards

## 🎯 Design Philosophy

Built following TSVNE principles:
- **Deterministic**: Same input → same output
- **Minimal Dependencies**: Only essential packages
- **Auditable**: Clean, commented code
- **Fail-Fast**: Clear error boundaries
- **Offline-First**: No external CDN dependencies

---

**Ready for deployment to www.vertyxnexus.pl** 🚀

For questions or issues, see [DEPLOY.md](public/DEPLOY.md) troubleshooting section.
