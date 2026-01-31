# Demo — VNEIL-GENESIS

Instrukcje uruchomienia demo (Windows / Linux / macOS)

1. Zainstaluj Node.js (zalecane LTS).

2. Zainstaluj zależności:

```bash
npm install
```

3. Uruchom demo:

```bash
npm start
# otwórz http://localhost:3000 w przeglądarce
```

4. Utwórz archiwum ZIP z demo:

```bash
npm run pack
# wygeneruje plik demo.zip w katalogu repo
```

Uwagi
- Pliki demo są minimalne — `index.js` (Express), `public/index.html` i `package.json`.
- Jeśli działasz na Windows bez zainstalowanego Node, zainstaluj Node lub poproś o scaffold dla innego runtime.
