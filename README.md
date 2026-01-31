# VNEIL-GENESIS

Repozytorium bazowe dla projektów zgodnych z TSVNE (True Single Verifiable Necessary Evidence).

## 🚀 VNEIL OS Initialization

New to VNEIL OS? Check out our comprehensive guides:
- 📘 **[VNEIL OS Setup Guide](VNEIL-OS-SETUP.md)** - Step-by-step repository initialization
- 🔧 **Quick start script**: `./scripts/init-vneil-os.sh [repository-url]`

## 🌐 VERTYX NEXUS Website

**Live site with interactive VNEIL OS map!**

To run the website locally:
```bash
npm install
npm start
# Visit: http://localhost:3000
```

For production deployment (GitHub Pages, Netlify, etc.):
- 📖 **[Complete Deployment Guide](DEPLOYMENT.md)**

The website includes:
- ✨ Futuristic dark UI with neon green accents
- 🗺️ Interactive VNEIL OS system map
- 📱 Fully responsive design
- 🎨 Smooth animations and hover effects

## TSVNE System

VNEIL-GENESIS implementuje zasady **TSVNE** — zestaw praktyk inżynierii oprogramowania zapewniających:
- **Determinizm**: ten sam input → ten sam output
- **Audytowalność**: każda decyzja jest weryfikowalna
- **Compliance-first**: zgodność z prawem od początku
- **Minimalizm**: tylko niezbędna złożoność

### Dokumentacja TSVNE

- 📘 [TSVNE System — Pełna Dokumentacja](TSVNE-SYSTEM.md)
- 👨‍💻 [TSVNE Developer Guide](TSVNE-DEVELOPER-GUIDE.md)
- 📝 [TSVNE Template Module](tsvne-template.js)
- ✅ [TSVNE Validator](tsvne-validator.js)

### Szybki Start

```bash
# Waliduj moduł pod kątem TSVNE compliance
node tsvne-validator.js my-module.js

# Uruchom testy TSVNE
node tsvne-validator.test.js
node tsvne-template.test.js
```

## Demo

Ten projekt zawiera również demo scaffoldy dla trzech popularnych runtime:
- **Node.js**: `npm start` — uruchamia demo serwer Express
- **Python**: `python_demo/app.py` — minimalna aplikacja Flask
- **.NET**: `dotnet run --project dotnet_demo` — konsola C#

Szczegóły: [README_DEMO.md](README_DEMO.md)