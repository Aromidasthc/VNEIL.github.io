# TSVNE Developer Guide

## Wprowadzenie

Ten przewodnik pomoże Ci tworzyć kod zgodny z zasadami TSVNE (True Single Verifiable Necessary Evidence) w repozytorium VNEIL-GENESIS.

## Szybki Start

### 1. Zrozum Podstawowe Zasady

Przeczytaj [TSVNE-SYSTEM.md](TSVNE-SYSTEM.md), aby zapoznać się z:
- SSOT (Single Source of Truth)
- Fail-fast validation
- Determinizm
- Audytowalność
- Minimalne zależności

### 2. Użyj Szablonu Modułu

Skopiuj szablon z `tsvne-template.js` i dostosuj do swoich potrzeb:

```bash
cp tsvne-template.js my-module.js
```

Edytuj nagłówek modułu:
- **Purpose**: Co robi ten moduł
- **Assumptions**: Co zakładasz o danych wejściowych
- **Invariants**: Co zawsze będzie prawdą
- **Failure Modes**: Jak moduł radzi sobie z błędami
- **Example**: Przykład użycia

### 3. Napisz Funkcje Zgodnie z TSVNE

#### Schemat Funkcji TSVNE-Compliant

```javascript
function myFunction(input) {
  // 1. Fail-fast: walidacja typu
  if (typeof input !== 'expectedType') {
    return { success: false, error: 'Invalid type' };
  }
  
  // 2. Fail-fast: walidacja wartości
  if (input < 0) {
    return { success: false, error: 'Must be positive' };
  }
  
  // 3. Deterministyczna logika biznesowa
  const result = processInput(input);
  
  // 4. Audytowalny zwrot
  return {
    success: true,
    value: result,
    metadata: { timestamp: new Date().toISOString() }
  };
}
```

### 4. Napisz Testy

Każdy moduł musi mieć co najmniej 3 rodzaje testów:

```javascript
const assert = require('assert');
const { myFunction } = require('./my-module');

// Test 1: Happy path
assert.deepStrictEqual(
  myFunction(validInput),
  { success: true, value: expectedOutput }
);

// Test 2: Fail-fast
assert.strictEqual(
  myFunction(invalidInput).success,
  false
);

// Test 3: Determinizm
const r1 = myFunction(input);
const r2 = myFunction(input);
assert.deepStrictEqual(r1, r2);
```

### 5. Waliduj Compliance

Uruchom walidator TSVNE na swoim module:

```bash
node tsvne-validator.js my-module.js
```

Wynik powinien być:
- **Score**: >= 70/100
- **Status**: ✅ COMPLIANT

### 6. Uruchom Testy

```bash
node my-module.test.js
```

Wszystkie testy muszą przejść przed commitem.

## Checklist Przed Commitem

Przed każdym commitem upewnij się, że:

- [ ] Moduł ma kompletny header (Purpose/Assumptions/Invariants/Failure/Example)
- [ ] Wszystkie funkcje publiczne mają fail-fast validation
- [ ] Brak globalnego stanu mutowalnego (unikaj `let`/`var` na poziomie modułu)
- [ ] Funkcje są deterministyczne (pure functions gdzie to możliwe)
- [ ] Logi nie zawierają danych wrażliwych (password, token, secret, key)
- [ ] Napisano co najmniej 3 testy (happy path, fail-fast, determinizm)
- [ ] `node tsvne-validator.js <file>` zwraca score >= 70
- [ ] Wszystkie testy przechodzą (`node <file>.test.js`)
- [ ] Nowe zależności są sprawdzone w GitHub Advisory Database
- [ ] Dokumentacja jest aktualna

## Przykłady z Życia Wziętych Problemów

### Problem 1: Globalna Mutacja Stanu

❌ **Źle**:
```javascript
let requestCount = 0;

function handleRequest(req) {
  requestCount++;
  return { id: requestCount };
}
```

✅ **Dobrze**:
```javascript
// Stan przenosimy do wywołującego
function handleRequest(req, currentCount) {
  return { 
    id: currentCount + 1,
    nextCount: currentCount + 1
  };
}

// Lub używamy SSOT object (tylko const)
const STATS = { requestCount: 0 };

function handleRequest(req) {
  const newCount = STATS.requestCount + 1;
  // Zwracamy nową wartość zamiast mutować
  return { id: newCount };
}
```

### Problem 2: Brak Fail-Fast

❌ **Źle**:
```javascript
function divideNumbers(a, b) {
  return a / b; // Może zwrócić Infinity lub NaN
}
```

✅ **Dobrze**:
```javascript
function divideNumbers(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return { success: false, error: 'Inputs must be numbers' };
  }
  
  if (b === 0) {
    return { success: false, error: 'Division by zero' };
  }
  
  return { success: true, value: a / b };
}
```

### Problem 3: Logowanie Danych Wrażliwych

❌ **Źle**:
```javascript
function loginUser(username, password) {
  console.log('Login attempt:', username, password); // NIGDY!
  // ...
}
```

✅ **Dobrze**:
```javascript
function loginUser(username, password) {
  console.log('Login attempt for user:', username); // Tylko username
  // password NIE trafia do logów
  // ...
}
```

### Problem 4: Niedeterministyczne Funkcje

❌ **Źle**:
```javascript
function generateId() {
  return Math.random().toString(36); // Niedeterministyczne
}
```

✅ **Dobrze** (jeśli deterministyczne ID jest możliwe):
```javascript
function generateId(seed) {
  // Używamy deterministycznego generatora (np. hash z seed)
  const hash = simpleHash(seed);
  return hash.toString(36);
}
```

✅ **Dobrze** (jeśli MUSI być losowe):
```javascript
// Izoluj niedeterministyczny kod w dedykowanej funkcji
function generateRandomId() {
  // Jasno oznacz jako non-deterministic
  return Math.random().toString(36);
}

// Reszta kodu pozostaje deterministyczna
function createUser(name, id) {
  return { name, id }; // Deterministyczne
}
```

## Narzędzia TSVNE w Repozytorium

### tsvne-validator.js
Waliduje compliance modułów JavaScript.

**Użycie**:
```bash
node tsvne-validator.js <file.js>
```

**Wyjście**:
- Exit code 0 = compliant
- Exit code 1 = non-compliant
- Exit code 2 = błąd odczytu pliku

### tsvne-template.js
Wzorcowy moduł TSVNE-compliant.

**Funkcje**:
- `calculateDiscount(price, rate)` — oblicza cenę po zniżce
- `validateEmail(email)` — waliduje format email
- `processBatch(items, fn)` — przetwarza tablicę deterministycznie
- `getConfig(key)` — SSOT dla konfiguracji

### tsvne-validator.test.js
Testy jednostkowe dla walidatora.

**Uruchomienie**:
```bash
node tsvne-validator.test.js
```

### tsvne-template.test.js
Testy jednostkowe dla szablonu.

**Uruchomienie**:
```bash
node tsvne-template.test.js
```

## FAQ

**Q: Co jeśli moja funkcja MUSI być niedeterministyczna (np. timestamp, random)?**  
A: Izoluj niedeterministyczne elementy w dedykowanych funkcjach i testuj je osobno. Reszta kodu powinna być deterministyczna.

**Q: Czy mogę używać `let` w funkcjach?**  
A: Tak, wewnątrz funkcji `let` jest OK. Unikaj tylko `let`/`var` na poziomie modułu (globalny stan).

**Q: Co jeśli moduł jest za duży i nie pasuje do jednego pliku?**  
A: Podziel na mniejsze moduły. Każdy moduł powinien mieć jasno zdefiniowaną odpowiedzialność (Single Responsibility Principle).

**Q: Jak testować funkcje asynchroniczne?**  
A: Użyj async/await w testach. Zasady TSVNE (fail-fast, determinizm) nadal obowiązują.

```javascript
async function testAsync() {
  const result = await myAsyncFunction(input);
  assert.strictEqual(result.success, true);
}
```

**Q: Czy TSVNE wymaga konkretnego frameworka testowego?**  
A: Nie. Możesz używać built-in `assert`, Jest, Mocha, lub innego. Ważne są zasady (happy/fail-fast/determinism), nie narzędzie.

**Q: Co jeśli nie mogę osiągnąć score >= 70 w walidatorze?**  
A: Sprawdź raport (`node tsvne-validator.js <file>`) i napraw zgłoszone problemy. Najczęstsze: brak headera, brak fail-fast, globalna mutacja.

## Dalsze Zasoby

- [TSVNE-SYSTEM.md](TSVNE-SYSTEM.md) — Pełna dokumentacja zasad TSVNE
- [tsvne-template.js](tsvne-template.js) — Wzorcowy moduł
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) — Robert C. Martin
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

## Wsparcie

Jeśli masz pytania lub potrzebujesz pomocy z TSVNE compliance:
1. Przeczytaj [TSVNE-SYSTEM.md](TSVNE-SYSTEM.md)
2. Sprawdź przykłady w `tsvne-template.js`
3. Uruchom walidator i przeanalizuj raport
4. Otwórz issue w repozytorium z tagiem `tsvne-question`

---

**Wersja**: 1.0.0  
**Data**: 2026-01-25  
**Autor**: VNEIL Programista
