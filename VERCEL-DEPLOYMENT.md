# VERCEL-DEPLOYMENT.md

## Wdrożenie projektu VNEIL-GENESIS na Vercel

Ten dokument zawiera szczegółowe instrukcje dotyczące wdrażania projektu VNEIL-GENESIS na platformie Vercel.

---

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Wymagania wstępne](#wymagania-wstępne)
3. [Krok 1: Przygotowanie projektu](#krok-1-przygotowanie-projektu)
4. [Krok 2: Połączenie z Vercel](#krok-2-połączenie-z-vercel)
5. [Krok 3: Konfiguracja zmiennych środowiskowych](#krok-3-konfiguracja-zmiennych-środowiskowych)
6. [Krok 4: Wdrożenie](#krok-4-wdrożenie)
7. [Krok 5: Konfiguracja domeny niestandardowej](#krok-5-konfiguracja-domeny-niestandardowej)
8. [Troubleshooting](#troubleshooting)
9. [Przydatne komendy](#przydatne-komendy)

---

## Wprowadzenie

Projekt VNEIL-GENESIS to aplikacja Node.js z Express.js, która serwuje:
- Stronę główną VERTYX NEXUS (z folderu `WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE`)
- Aplikację demo (dostępną pod ścieżką `/demo`)
- API endpoint `/api/health` do sprawdzania stanu aplikacji

---

## Wymagania wstępne

Przed rozpoczęciem upewnij się, że masz:

1. **Konto na GitHub**
   - Projekt musi być w repozytorium GitHub
   - Adres: https://github.com/Aromidasthc/VNEIL-GENESIS

2. **Konto na Vercel**
   - Zarejestruj się na: https://vercel.com
   - Można zalogować się przez GitHub (zalecane)

3. **Node.js i npm**
   - Node.js w wersji 14.x lub nowszej
   - npm do zarządzania zależnościami

---

## Krok 1: Przygotowanie projektu

### 1.1. Weryfikacja plików konfiguracyjnych

Upewnij się, że w głównym katalogu projektu znajdują się następujące pliki:

- ✅ `vercel.json` - konfiguracja Vercel
- ✅ `package.json` - z odpowiednimi skryptami
- ✅ `.vercelignore` - wykluczenie niepotrzebnych plików

### 1.2. Sprawdź package.json

Plik `package.json` powinien zawierać:

```json
{
  "name": "vneil-genesis-demo",
  "version": "0.1.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "build": "echo 'Build completed - no build step needed for this project'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "archiver": "^5.3.1",
    "tar": "^7.5.6"
  }
}
```

**Ważne:** Wszystkie zależności potrzebne w produkcji muszą być w sekcji `dependencies`, nie w `devDependencies`.

### 1.3. Sprawdź index.js

Aplikacja musi nasłuchiwać na porcie z zmiennej środowiskowej `PORT`:

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

✅ To jest już zaimplementowane w projekcie.

### 1.4. Test lokalny

Przed wdrożeniem przetestuj aplikację lokalnie:

```bash
# Zainstaluj zależności
npm install

# Uruchom serwer
npm start

# Sprawdź czy działa
# Otwórz http://localhost:3000 w przeglądarce
```

---

## Krok 2: Połączenie z Vercel

### 2.1. Zaloguj się do Vercel

1. Przejdź na https://vercel.com
2. Kliknij **"Sign Up"** lub **"Login"**
3. Wybierz **"Continue with GitHub"** (zalecane)
4. Zaakceptuj uprawnienia dostępu do GitHub

### 2.2. Import projektu

1. Na dashboardzie Vercel kliknij **"Add New..."** → **"Project"**
2. Znajdź repozytorium **"Aromidasthc/VNEIL-GENESIS"** na liście
3. Kliknij **"Import"**

### 2.3. Konfiguracja projektu

Na ekranie konfiguracji:

1. **Project Name**: zostaw domyślną lub zmień (np. `vneil-genesis`)
2. **Framework Preset**: wybierz **"Other"** lub **"Express.js"**
3. **Root Directory**: zostaw `./` (główny katalog)
4. **Build Command**: `npm run build` (lub zostaw puste)
5. **Output Directory**: zostaw puste (Vercel wykryje automatycznie)
6. **Install Command**: `npm install` (domyślne)

### 2.4. Konfiguracja zmiennych środowiskowych (opcjonalnie)

Jeśli projekt wymaga zmiennych środowiskowych, dodaj je w sekcji **"Environment Variables"**:

```
NODE_ENV=production
PORT=3000
```

**Uwaga:** Vercel automatycznie ustawia `PORT`, więc nie musisz jej dodawać ręcznie.

### 2.5. Wdrożenie

1. Kliknij **"Deploy"**
2. Poczekaj na zakończenie procesu (1-3 minuty)
3. Po zakończeniu zobaczysz adres URL Twojej aplikacji (np. `vneil-genesis.vercel.app`)

---

## Krok 3: Konfiguracja zmiennych środowiskowych

### 3.1. Dostęp do ustawień

1. Przejdź do dashboardu projektu na Vercel
2. Kliknij zakładkę **"Settings"**
3. Wybierz **"Environment Variables"** w menu bocznym

### 3.2. Dodawanie zmiennych

Kliknij **"Add"** i wprowadź:

| Key | Value | Environment |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Production, Preview, Development |

### 3.3. Zastosowanie zmian

Zmienne środowiskowe są automatycznie dostępne po:
- Następnym wdrożeniu (push do GitHub)
- Ręcznym ponownym wdrożeniu (Redeploy)

---

## Krok 4: Wdrożenie

### 4.1. Automatyczne wdrożenia

Vercel automatycznie wdraża projekt przy każdym:
- **Push do głównej gałęzi** (`main` lub `master`) → wdrożenie produkcyjne
- **Pull Request** → wdrożenie preview (testowe)

### 4.2. Ręczne wdrożenie

Możesz też wdrożyć ręcznie:

1. Przejdź do zakładki **"Deployments"**
2. Kliknij **"..."** przy najnowszym wdrożeniu
3. Wybierz **"Redeploy"**

### 4.3. Weryfikacja wdrożenia

Po wdrożeniu sprawdź:

1. **Status:** zielony checkmark = sukces
2. **URL aplikacji:** kliknij "Visit" aby otworzyć
3. **Logi:** sprawdź zakładkę "Logs" w przypadku problemów

Sprawdź endpointy:
- Strona główna: `https://your-app.vercel.app/`
- Demo: `https://your-app.vercel.app/demo`
- Health check: `https://your-app.vercel.app/api/health`

---

## Krok 5: Konfiguracja domeny niestandardowej

### 5.1. Dodanie domeny (np. vertyxnexus.pl)

1. Przejdź do **Settings** → **Domains**
2. Kliknij **"Add"**
3. Wprowadź domenę: `vertyxnexus.pl`
4. Kliknij **"Add"**

### 5.2. Konfiguracja DNS

Vercel pokaże Ci wymagane rekordy DNS. Dodaj je u swojego dostawcy domeny:

#### Opcja A: Domena główna (vertyxnexus.pl)

Dodaj rekord **A**:
```
Type: A
Name: @
Value: 76.76.21.21
```

#### Opcja B: Subdomena (www.vertyxnexus.pl)

Dodaj rekord **CNAME**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3. Przekierowanie WWW ↔ bez WWW

W ustawieniach domeny na Vercel możesz skonfigurować:
- **Redirect www to non-www:** `www.vertyxnexus.pl` → `vertyxnexus.pl`
- **Redirect non-www to www:** `vertyxnexus.pl` → `www.vertyxnexus.pl`

### 5.4. SSL/HTTPS

Vercel automatycznie:
- ✅ Generuje certyfikat SSL (Let's Encrypt)
- ✅ Wymusza HTTPS
- ✅ Odnawia certyfikat przed wygaśnięciem

Certyfikat jest aktywny w ciągu kilku minut po dodaniu domeny.

---

## Troubleshooting

### Problem 1: "500: INTERNAL_SERVER_ERROR" lub "FUNCTION_INVOCATION_FAILED"

**Przyczyna:** Aplikacja Express próbuje wywołać `app.listen()` w środowisku serverless, co nie działa na Vercel

**Rozwiązanie:**
1. Sprawdź czy `index.js` eksportuje aplikację Express jako domyślny eksport: `module.exports = app`
2. Upewnij się, że `app.listen()` jest opakowane w warunek: `if (require.main === module)`
3. To pozwala aplikacji działać lokalnie (`npm start`) i jako serverless function na Vercel
4. Po poprawie, zrób commit i push - Vercel automatycznie wdroży nową wersję

**Przykład poprawnej konfiguracji:**
```javascript
// index.js
const app = express();
// ... konfiguracja routingu ...

// Uruchom serwer tylko lokalnie, nie w serverless
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Eksportuj dla Vercel
module.exports = app;
```

### Problem 2: "Application Error" po wdrożeniu

**Przyczyna:** Błąd w kodzie aplikacji

**Rozwiązanie:**
1. Sprawdź logi: **Deployments** → wybierz wdrożenie → **Runtime Logs**
2. Sprawdź czy wszystkie zależności są w `dependencies` w `package.json`
3. Upewnij się, że aplikacja nasłuchuje na `process.env.PORT`

### Problem 3: "404: NOT_FOUND"

**Przyczyna:** Nieprawidłowe routing lub brakujące pliki

**Rozwiązanie:**
1. Sprawdź plik `vercel.json` - czy routing jest poprawny
2. Upewnij się, że folder `WWW.VERTYXNEXUS.PL/VER_TYX_NEXUS_SITE` istnieje
3. Sprawdź czy pliki nie są w `.vercelignore`

### Problem 4: "Build failed"

**Przyczyna:** Błąd podczas instalacji zależności lub build

**Rozwiązanie:**
1. Sprawdź **Build Logs** w zakładce wdrożenia
2. Upewnij się, że `package.json` jest poprawny
3. Sprawdź czy wszystkie zależności są dostępne w npm registry
4. Usuń `package-lock.json` i spróbuj ponownie

### Problem 5: Statyczne pliki nie są serwowane

**Przyczyna:** Nieprawidłowa konfiguracja ścieżek

**Rozwiązanie:**
1. Sprawdź czy `express.static` używa `path.join(__dirname, '...')`
2. Upewnij się, że foldery z plikami statycznymi istnieją w repozytorium
3. Sprawdź czy foldery nie są w `.vercelignore`

### Problem 6: Domena nie działa

**Przyczyna:** Nieprawidłowa konfiguracja DNS

**Rozwiązanie:**
1. Sprawdź rekordy DNS u dostawcy domeny (może trwać do 48h)
2. Użyj narzędzia do sprawdzenia DNS: https://dnschecker.org
3. Upewnij się, że rekordy są dokładnie takie jak podaje Vercel
4. Czekaj - propagacja DNS może trwać do 48 godzin

### Problem 7: "Function Timeout"

**Przyczyna:** Aplikacja działa dłużej niż 10 sekund (limit darmowego planu)

**Rozwiązanie:**
1. Zoptymalizuj kod aplikacji
2. Rozważ upgrade do płatnego planu Vercel Pro (60s timeout)
3. Przenieś długo działające operacje do osobnej funkcji

---

## Przydatne komendy

### Vercel CLI

Możesz też używać CLI do zarządzania wdrożeniami:

```bash
# Instalacja Vercel CLI
npm install -g vercel

# Zaloguj się
vercel login

# Wdrożenie do preview
vercel

# Wdrożenie do produkcji
vercel --prod

# Lista wszystkich wdrożeń
vercel list

# Sprawdzenie logów
vercel logs <deployment-url>

# Usunięcie wdrożenia
vercel remove <deployment-name>
```

### Lokalne testowanie

```bash
# Instalacja zależności
npm install

# Uruchomienie aplikacji
npm start

# Test endpointu health
curl http://localhost:3000/api/health

# Test w przeglądarce
open http://localhost:3000
```

---

## Dodatkowe zasoby

- **Dokumentacja Vercel:** https://vercel.com/docs
- **Vercel Node.js:** https://vercel.com/docs/functions/serverless-functions/runtimes/node-js
- **Express.js na Vercel:** https://vercel.com/guides/using-express-with-vercel
- **Konfiguracja domen:** https://vercel.com/docs/concepts/projects/domains
- **Zmienne środowiskowe:** https://vercel.com/docs/concepts/projects/environment-variables

---

## Podsumowanie

Po wykonaniu wszystkich kroków:

✅ Projekt jest wdrożony na Vercel  
✅ Automatyczne wdrożenia przy każdym push do GitHub  
✅ Domena niestandardowa skonfigurowana (opcjonalnie)  
✅ SSL/HTTPS włączone automatycznie  
✅ Monitoring i logi dostępne w dashboardzie Vercel  

**Gratulacje! Twój projekt jest online! 🎉**

---

## Kontakt i wsparcie

Jeśli napotkasz problemy:

1. Sprawdź sekcję [Troubleshooting](#troubleshooting)
2. Sprawdź logi wdrożenia na Vercel
3. Skonsultuj dokumentację Vercel: https://vercel.com/docs
4. Otwórz issue na GitHub: https://github.com/Aromidasthc/VNEIL-GENESIS/issues

---

*Dokument utworzony dla projektu VNEIL-GENESIS*  
*Ostatnia aktualizacja: 2026-01-26*
