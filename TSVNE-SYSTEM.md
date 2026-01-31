# TSVNE System — True Single Verifiable Necessary Evidence

## Cel i Definicja

**TSVNE (True Single Verifiable Necessary Evidence)** to zbiór zasad inżynierii oprogramowania zapewniających:
- **Determinizm**: ten sam input → ten sam output
- **Audytowalność**: każda decyzja jest weryfikowalna
- **Compliance-first**: zgodność z prawem i regulacjami od początku
- **Minimalizm**: tylko niezbędna złożoność

TSVNE jest rozszerzeniem **SVNE (Single Verifiable Necessary Evidence)** o element "True" (prawdy/determinizmu).

## Podstawowe Zasady

### 1. SSOT (Single Source of Truth)
Jedna, centralna definicja dla każdego elementu stanu lub konfiguracji.

**Przykład**:
```javascript
// ❌ Źle: duplikacja konfiguracji
const API_URL = "https://api.example.com";
const BACKUP_API = "https://api.example.com"; // duplikat

// ✅ Dobrze: SSOT
const CONFIG = {
  apiUrl: "https://api.example.com"
};
```

### 2. Fail-Fast
Walidacja inputów jak najwcześniej, zwracanie eksplicytnych błędów.

**Przykład**:
```javascript
// ❌ Źle: cicha awaria
function processUser(user) {
  if (user) { /* ... */ }
}

// ✅ Dobrze: fail-fast
function processUser(user) {
  if (!user) throw new Error("User is required");
  if (!user.id) throw new Error("User ID is required");
  // kontynuuj przetwarzanie
}
```

### 3. Determinizm
Funkcje czyste, unikanie globalnego stanu, przewidywalne zachowanie.

**Przykład**:
```javascript
// ❌ Źle: niedeterministyczne
let counter = 0;
function increment() { return ++counter; }

// ✅ Dobrze: deterministyczne
function increment(value) { return value + 1; }
```

### 4. Audytowalność
Każda operacja ma:
- Wejście (input) — jasno zdefiniowane
- Wyjście (output) — weryfikowalne
- Logi (bez danych wrażliwych)
- Kod wyjścia / status

**Przykład**:
```javascript
// ✅ Audytowalna funkcja
function validateEmail(email) {
  // Input validation
  if (typeof email !== 'string') {
    return { valid: false, reason: 'Email must be a string' };
  }
  
  // Business logic
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  // Auditable output
  return {
    valid: isValid,
    reason: isValid ? 'Valid format' : 'Invalid email format',
    timestamp: new Date().toISOString()
  };
}
```

### 5. Minimalne Zależności
Dodaj zależność tylko jeśli:
- Jest absolutnie konieczna
- Jest dobrze utrzymywana
- Przeszła audyt bezpieczeństwa
- Ma jasną licencję

**Proces**:
1. Sprawdź czy funkcjonalność można zaimplementować bez zależności
2. Jeśli nie, wybierz najbardziej minimalną bibliotekę
3. Zweryfikuj w GitHub Advisory Database
4. Udokumentuj dlaczego jest potrzebna

### 6. Proof-Driven Delivery
Każdy moduł dostarcza:
- **Założenia** (Assumptions): co zakładamy o inputach
- **Niezmienniki** (Invariants): co zawsze jest prawdą
- **Reguły walidacji** (Validation): jak sprawdzamy poprawność
- **Testy** (Tests): co najmniej jeden test jednostkowy
- **Przykład użycia** (Example): jak używać modułu

## Struktura Modułu TSVNE-Compliant

```javascript
/**
 * MODULE: EmailValidator
 * 
 * Purpose: Validate email addresses according to RFC 5322 (simplified)
 * 
 * Assumptions:
 * - Input is a string or null/undefined
 * - No support for internationalized email addresses
 * 
 * Invariants:
 * - Function always returns an object with { valid: boolean, reason: string }
 * - No side effects (pure function)
 * - Deterministic: same input → same output
 * 
 * Failure Modes:
 * - Returns { valid: false } for invalid inputs (never throws)
 * 
 * Example:
 *   const result = validateEmail("user@example.com");
 *   if (result.valid) { console.log("Valid email"); }
 */

function validateEmail(email) {
  // Fail-fast validation
  if (email === null || email === undefined) {
    return { valid: false, reason: 'Email is required' };
  }
  
  if (typeof email !== 'string') {
    return { valid: false, reason: 'Email must be a string' };
  }
  
  // Business logic (deterministic)
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = regex.test(email);
  
  // Auditable output
  return {
    valid: isValid,
    reason: isValid ? 'Valid email format' : 'Invalid email format'
  };
}

module.exports = { validateEmail };
```

## Testy TSVNE

Każdy moduł powinien mieć co najmniej:
1. **Test happy path** — poprawny input
2. **Test fail-fast** — niepoprawny input
3. **Test determinizmu** — wielokrotne wywołanie z tym samym inputem

**Przykład testu**:
```javascript
const assert = require('assert');
const { validateEmail } = require('./emailValidator');

// Test 1: Happy path
assert.strictEqual(validateEmail("user@example.com").valid, true);

// Test 2: Fail-fast
assert.strictEqual(validateEmail(null).valid, false);
assert.strictEqual(validateEmail(123).valid, false);

// Test 3: Determinizm
const email = "test@test.com";
const result1 = validateEmail(email);
const result2 = validateEmail(email);
assert.deepStrictEqual(result1, result2);

console.log("✅ All TSVNE tests passed");
```

## Checklist TSVNE Compliance

Przed zatwierdzeniem modułu sprawdź:

- [ ] Moduł ma header z Purpose/Assumptions/Invariants/Failure modes/Example
- [ ] Wszystkie funkcje publiczne są deterministyczne (pure functions)
- [ ] Walidacja inputów jest fail-fast (na początku funkcji)
- [ ] Konfiguracja/stan ma SSOT
- [ ] Brak hardcoded secrets/credentials
- [ ] Logi nie zawierają danych wrażliwych (PII, credentials)
- [ ] Co najmniej 3 testy (happy, fail-fast, determinism)
- [ ] Nowe zależności są uzasadnione i sprawdzone
- [ ] Kod jest minimalny (tylko to co konieczne)

## Workflow TSVNE

1. **Plan** (max 6 punktów) — co ma zostać zrobione
2. **Implementacja** z headerem modułu
3. **Testy** (minimum 3)
4. **Audyt** — checklist compliance
5. **Commit** — jeden commit na feature z opisowym message

## Kompatybilność z Innymi Standardami

TSVNE jest kompatybilne z:
- **Clean Code** (Robert C. Martin)
- **SOLID** principles
- **Functional Programming** paradigms
- **GDPR/RODO** (redakcja danych wrażliwych)
- **ISO 27001** (audytowalność)

## Przykłady Zastosowania

### CLI Tool
```javascript
#!/usr/bin/env node
// Purpose: TSVNE-compliant CLI tool
// Assumptions: Node.js >= 14
// Invariants: Exit code 0 = success, non-zero = failure

function main(args) {
  // Fail-fast
  if (!Array.isArray(args) || args.length === 0) {
    console.error("Error: No arguments provided");
    process.exit(1);
  }
  
  // Deterministic logic
  const result = processArgs(args);
  
  // Auditable output
  console.log(JSON.stringify({ status: 'success', result }));
  process.exit(0);
}

function processArgs(args) {
  return args.map(arg => arg.toUpperCase());
}

// Execute
if (require.main === module) {
  main(process.argv.slice(2));
}
```

### API Endpoint
```javascript
// TSVNE-compliant Express endpoint
app.post('/api/validate', (req, res) => {
  try {
    // Fail-fast
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Deterministic validation
    const result = validateEmail(email);
    
    // Auditable response
    res.json({
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    // Safe error logging (no sensitive data)
    console.error('Validation error:', err.message);
    res.status(500).json({ error: 'Internal error' });
  }
});
```

## Narzędzia TSVNE

W tym repozytorium dostępne są:
- `tsvne-validator.js` — walidator compliance modułów
- `tsvne-template.js` — szablon TSVNE-compliant modułu
- Testy jednostkowe dla powyższych narzędzi

## Pytania i Odpowiedzi

**Q: Czy TSVNE wymaga konkretnego języka programowania?**  
A: Nie. TSVNE to zbiór zasad, które można zastosować w JavaScript, Python, C#, Go, Rust, etc.

**Q: Czy mogę użyć frameworków (React, Express, Django)?**  
A: Tak, o ile nie naruszasz zasad TSVNE (determinizm, fail-fast, minimalizm).

**Q: Co zrobić jeśli nie mogę osiągnąć pełnego determinizmu (np. timestamp)?**  
A: Izoluj niedeterministyczne elementy w dedykowanych funkcjach i testuj je oddzielnie. Reszta kodu powinna być deterministyczna.

**Q: Czy TSVNE jest kompatybilne z Agile/Scrum?**  
A: Tak. TSVNE dotyczy jakości kodu, nie metodyki zarządzania projektem.

## Referencje

- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) — Robert C. Martin
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [GDPR Article 32](https://gdpr-info.eu/art-32-gdpr/) — Security of processing
- [ISO/IEC 27001](https://www.iso.org/isoiec-27001-information-security.html) — Information security

---

**Wersja**: 1.0.0  
**Data**: 2026-01-25  
**Autor**: VNEIL Programista  
**Licencja**: MIT (lub zgodnie z repozytorium)
