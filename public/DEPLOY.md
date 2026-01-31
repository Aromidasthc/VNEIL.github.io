# VNEIL OS - Deployment Guide

## 🚀 Quick Start (Click-to-Deploy)

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Deployment

#### 1. Install Dependencies
```bash
cd /path/to/VNEIL-GENESIS
npm install
```

#### 2. Start the Server
```bash
npm start
```

The website will be available at: **http://localhost:3000**

#### 3. Stop the Server
Press `Ctrl+C` in the terminal where the server is running.

---

## 📁 File Structure

```
public/
├── index.html      # Main HTML page with futuristic layout
├── styles.css      # Dark theme with neon animations
├── app.js          # Interactive OS map (vanilla JavaScript)
└── logo.jpeg       # VERTYX NEXUS EIL logo
```

---

## 🌐 Production Deployment Options

### Option A: Deploy to Cloud (Recommended)

#### Heroku
1. Create a `Procfile` in the root directory:
   ```
   web: node index.js
   ```

2. Deploy:
   ```bash
   heroku create vertyxnexus
   git push heroku main
   ```

#### Render.com
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Deploy automatically on push

#### Railway.app
1. Connect GitHub repository
2. Select the project
3. Deploy automatically (detects npm start)

### Option B: Deploy to VPS/Server

#### Using PM2 (Process Manager)
1. Install PM2:
   ```bash
   npm install -g pm2
   ```

2. Start with PM2:
   ```bash
   pm2 start index.js --name vneil-os
   pm2 save
   pm2 startup
   ```

3. Server will auto-restart on crashes and server reboot

#### Using systemd (Linux)
1. Create service file `/etc/systemd/system/vneil-os.service`:
   ```ini
   [Unit]
   Description=VNEIL OS Website
   After=network.target

   [Service]
   Type=simple
   User=your-username
   WorkingDirectory=/path/to/VNEIL-GENESIS
   ExecStart=/usr/bin/node index.js
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

2. Enable and start:
   ```bash
   sudo systemctl enable vneil-os
   sudo systemctl start vneil-os
   ```

### Option C: Deploy with Docker

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build and run:
   ```bash
   docker build -t vneil-os .
   docker run -d -p 3000:3000 vneil-os
   ```

---

## 🔧 Configuration

### Change Port
Set the `PORT` environment variable:
```bash
PORT=8080 npm start
```

Or edit `index.js` line 5:
```javascript
const PORT = process.env.PORT || 8080;
```

### Custom Domain Setup
1. Point your domain DNS A record to your server IP
2. Use Nginx/Apache as reverse proxy:

**Nginx example** (`/etc/nginx/sites-available/vertyxnexus.pl`):
```nginx
server {
    listen 80;
    server_name vertyxnexus.pl www.vertyxnexus.pl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable HTTPS with Let's Encrypt:
```bash
sudo certbot --nginx -d vertyxnexus.pl -d www.vertyxnexus.pl
```

---

## 🎨 Customization

### Change Neon Colors
Edit `public/styles.css` lines 7-8:
```css
--neon-green: #00ff88;  /* Change to your color */
--neon-cyan: #00d4ff;   /* Change to your color */
```

### Modify OS Map Structure
Edit `public/app.js` lines 12-86 (VNEIL_STRUCTURE object) to change the system map.

### Update Logo
Replace `public/logo.jpeg` with your logo file (keep same filename or update `index.html`).

---

## 🧪 Testing

### Local Testing
1. Start server: `npm start`
2. Open browser: http://localhost:3000
3. Check:
   - Logo displays correctly
   - Neon animations are working
   - OS map is interactive (click nodes)
   - Health API: http://localhost:3000/api/health

### Verification Checklist
- [ ] Dark theme with neon green/cyan accents visible
- [ ] Logo appears at top with glow effect
- [ ] System title "VNEIL OS" has gradient effect
- [ ] Interactive map shows VNEIL structure
- [ ] Clicking nodes highlights them
- [ ] Hover effects work on all interactive elements
- [ ] Status indicator shows "System operacyjny: AKTYWNY"
- [ ] Page is responsive on mobile devices

---

## 📊 Performance

- **Load Time**: < 1 second (all CSS/JS inline or local)
- **Dependencies**: Express.js only (minimal)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: Fully responsive

---

## 🛡️ Security Notes

- Server runs on localhost by default (safe for development)
- For production: use reverse proxy (Nginx/Apache)
- Enable HTTPS in production
- No sensitive data exposed in client code
- Health API endpoint is read-only

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill process using port
kill -9 <PID>

# Or use different port
PORT=8080 npm start
```

### Styles not loading
- Check browser console for errors
- Verify `public/styles.css` exists
- Clear browser cache (Ctrl+Shift+R)

### Map not displaying
- Check browser console for JavaScript errors
- Verify `public/app.js` exists
- Ensure DOM is loaded before script runs

### Dependencies missing
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

For issues or questions:
1. Check this guide thoroughly
2. Verify all files are in correct locations
3. Check server logs in terminal
4. Test in different browser

---

## 📝 System Requirements

**Minimum:**
- Node.js 14+
- 512 MB RAM
- Any modern web browser

**Recommended:**
- Node.js 18+
- 1 GB RAM
- Chrome/Firefox latest version

---

**Version:** 1.0  
**Last Updated:** 2024-01-26  
**Created for:** VERTYX NEXUS EIL / VNEIL-GENESIS
