# VNEIL-GENESIS

Repozytorium bazowe dla projektów zgodnych z TSVNE (True Single Verifiable Necessary Evidence).

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