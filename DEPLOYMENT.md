# 🚀 Deployment Guide for www.vertyxnexus.pl

This guide provides step-by-step instructions for deploying the VERTYX NEXUS website with the interactive VNEIL OS map.

## 📋 Quick Overview

The site is a **static HTML/CSS/JavaScript** website with no build step required. It includes:
- Dark theme with neon green accents
- Interactive VNEIL OS system map
- Responsive design
- Contact form (mailto integration)
- Logo and branding assets

---

## 🌐 Option 1: GitHub Pages (Recommended)

### Prerequisites
- GitHub repository with the website files
- GitHub account with repository access

### Steps

#### 1. Prepare the Files

The website files are located in: `WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE/`

Files needed for deployment:
```
├── index.html          # Main website file
├── logo.png           # Logo image
└── old_logo.png       # Backup logo
```

#### 2. Enable GitHub Pages

**Method A: Via Repository Settings (UI)**

1. Go to your repository on GitHub: `https://github.com/Aromidasthc/VNEIL-GENESIS`
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Branch: `main` (or your preferred branch)
   - Folder: `/WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE/` (if available)
   - OR Folder: `/` (root) and move files to root
5. Click **Save**
6. Wait 1-2 minutes for deployment
7. Your site will be live at: `https://aromidasthc.github.io/VNEIL-GENESIS/`

**Method B: Create `docs` folder (Alternative)**

1. Copy files to a `docs` folder in the repository root:
   ```bash
   mkdir -p docs
   cp WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE/* docs/
   git add docs
   git commit -m "Add docs folder for GitHub Pages"
   git push
   ```

2. In GitHub Settings → Pages:
   - Branch: `main`
   - Folder: `/docs`
   - Click **Save**

3. Site will be live at: `https://aromidasthc.github.io/VNEIL-GENESIS/`

#### 3. Custom Domain (Optional)

If you own `vertyxnexus.pl`:

1. In your domain registrar (e.g., OVH, Cloudflare), add these DNS records:
   ```
   Type: CNAME
   Name: www
   Value: aromidasthc.github.io
   
   Type: A (for apex domain @)
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

2. In GitHub Settings → Pages:
   - Enter custom domain: `www.vertyxnexus.pl`
   - Check "Enforce HTTPS"
   - Click **Save**

3. Wait for DNS propagation (up to 24-48 hours)

---

## 🖥️ Option 2: Traditional Web Hosting (cPanel/FTP)

### Prerequisites
- Web hosting account (e.g., OVH, home.pl)
- FTP credentials or cPanel access

### Steps

#### 1. Connect via FTP

Use an FTP client (FileZilla, WinSCP, or cPanel File Manager):

- Host: `ftp.vertyxnexus.pl` (or provided by host)
- Username: Your hosting username
- Password: Your hosting password
- Port: 21 (FTP) or 22 (SFTP)

#### 2. Upload Files

1. Navigate to your public HTML directory:
   - Usually: `/public_html/` or `/www/` or `/httpdocs/`

2. Upload these files:
   ```
   WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE/index.html
   WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE/logo.png
   WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE/old_logo.png
   ```

3. Ensure `index.html` is in the root of your public directory

#### 3. Verify Permissions

Set file permissions (if needed):
- Files: `644` (rw-r--r--)
- Directories: `755` (rwxr-xr-x)

#### 4. Test

Visit: `https://www.vertyxnexus.pl` or `https://vertyxnexus.pl`

---

## 🐳 Option 3: Node.js Server (Express)

For dynamic hosting with the included Express server.

### Prerequisites
- Node.js installed (v14+)
- npm installed

### Steps

#### 1. Install Dependencies

```bash
cd /path/to/VNEIL-GENESIS
npm install
```

#### 2. Start the Server

**Development:**
```bash
npm start
```

Server runs at: `http://localhost:3000`

**Production (with PM2):**
```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start index.js --name "vertyx-nexus"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 3. Deploy to VPS/Cloud

**On your VPS (Ubuntu/Debian):**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/Aromidasthc/VNEIL-GENESIS.git
cd VNEIL-GENESIS

# Install dependencies
npm install

# Start with PM2
pm2 start index.js --name "vertyx-nexus"
pm2 save
pm2 startup
```

**Setup Nginx reverse proxy:**

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

Then:
```bash
sudo ln -s /etc/nginx/sites-available/vertyxnexus.pl /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Add SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d vertyxnexus.pl -d www.vertyxnexus.pl
```

---

## 🔄 Option 4: Netlify (Free Tier)

### Steps

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub account
4. Select the `VNEIL-GENESIS` repository
5. Configure:
   - Base directory: `WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE`
   - Build command: (leave empty)
   - Publish directory: `.` (current directory)
6. Click **Deploy site**
7. Your site will be live at: `https://random-name.netlify.app`
8. Optional: Add custom domain in Netlify settings

---

## 🚦 Option 5: Vercel (Free Tier)

### Steps

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Other**
   - Root Directory: `WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. Click **Deploy**
6. Your site will be live at: `https://project-name.vercel.app`
7. Optional: Add custom domain in Vercel settings

---

## ✅ Post-Deployment Checklist

After deploying, verify:

- [ ] Homepage loads correctly
- [ ] Logo displays properly
- [ ] Navigation links work (#vneil-os, #oferta, etc.)
- [ ] VNEIL OS map is visible and interactive
- [ ] Clicking nodes shows information panel
- [ ] All sections scroll smoothly
- [ ] Contact form opens email client
- [ ] Mobile responsiveness works
- [ ] HTTPS is enabled (for production)

---

## 🛠️ Troubleshooting

### Images Not Loading

**Issue:** Logo doesn't appear

**Solution:** Check image paths are correct relative to `index.html`
```html
<img src="logo.png" alt="VERTYX NEXUS logo" />
```

### Interactive Map Not Working

**Issue:** Clicking nodes doesn't show information

**Solution:** 
1. Check browser console for JavaScript errors (F12)
2. Ensure the full `index.html` file was uploaded
3. Check that JavaScript is enabled in browser

### GitHub Pages 404 Error

**Issue:** Page shows 404

**Solution:**
1. Verify branch and folder settings in GitHub Pages
2. Check that `index.html` is in the configured directory
3. Wait 1-2 minutes after saving settings

### Custom Domain Not Working

**Issue:** Domain doesn't redirect to site

**Solution:**
1. Verify DNS records in domain registrar
2. Wait for DNS propagation (up to 48 hours)
3. Clear browser cache
4. Check GitHub Pages custom domain settings

---

## 📞 Support

For issues or questions:
- Email: kontakt.vertyx@vertyxnexus.pl
- Repository: https://github.com/Aromidasthc/VNEIL-GENESIS

---

## 🎯 Local Development

To run locally for testing:

```bash
# Clone repository
git clone https://github.com/Aromidasthc/VNEIL-GENESIS.git
cd VNEIL-GENESIS

# Option 1: Use Node.js server
npm install
npm start
# Visit: http://localhost:3000

# Option 2: Use Python simple server
cd WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE
python -m http.server 8000
# Visit: http://localhost:8000

# Option 3: Open directly in browser
# Simply open WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE/index.html in your browser
```

---

## 📝 License & Credits

- **TSVNE System**: Deterministic, auditable, compliance-first architecture
- **Design**: Dark theme with neon green energy aesthetics
- **Interactive Map**: Vanilla JavaScript (no external dependencies)
