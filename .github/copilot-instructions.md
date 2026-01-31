<!-- Short, actionable instructions for AI coding agents working in this repository -->
<!-- Krótkie, praktyczne instrukcje dla agentów AI pracujących w tym repozytorium -->
# Instrukcje Copilot dla repozytorium

Cel
- Pomóc agentowi AI szybko zacząć pracę w tym repozytorium, opisując "co" i "gdzie" zamiast ogólnych porad.

Ogólny obraz (co znalazłem)
- Repozytorium zawiera głównie dokumentację/konfigurację. Główne pliki: [README.md](README.md) oraz plik [CZATY PROJEKTU STABILIZACJA I UGRUNTOWANIE](CZATY%20PROJEKTU%20STABILIZACJA%20I%20UGRUNTOWANIE).
- Nie wykryto kodu źródłowego, skryptów build, runnerów testów ani manifestów paczek (`package.json`, `requirements.txt`, `pyproject.toml`, `Makefile` itp.). Obecne jest repozytorium Git (`.git`).

Ścisłe wskazówki repozytorium
- Nie zakładaj istnienia toolchaina build/test: brak plików konfiguracyjnych dla typowych środowisk.
- Plik `CZATY PROJEKTU STABILIZACJA I UGRUNTOWANIE` zawiera komendę Windows/`winget` do instalacji Git — traktuj to jako wskazówkę, że autor korzysta z Windows/winget.

Przykład (z repozytorium)

```
winget install --id Git.Git -e --source winget
```

Konwencje i bezpieczne domyślne opcje edycji
- W repozytorium są pliki z odstępami w nazwach — zachowuj oryginalne nazwy i kodowanie, chyba że użytkownik zażąda zmiany.
- Wprowadzaj zachowawcze zmiany: aktualizuj `README.md` lub dodawaj nowe pliki u podstawy repozytorium lub w nowym katalogu. Jeśli dodajesz automatyzację (CI/build), opisz założenia i poproś o potwierdzenie przed commitem.
- Zapytaj przed automatyczną zmianą języka (polski ↔ angielski); tytuł repo wskazuje na możliwą preferencję językową (polski).

Gdy brakuje informacji
- Zadawaj konkretne pytania: (1) czy projekt ma być kodem czy wyłącznie dokumentacją, (2) preferowany język, (3) oczekiwana CI/packer/manifest.
- Jeśli mamy szkicować strukturę projektu (scaffold), poproś o preferowany runtime/stack i przykładowe szablony.

Gdzie szukać dalej
- Zaczynaj od [README.md](README.md) oraz [CZATY PROJEKTU STABILIZACJA I UGRUNTOWANIE](CZATY%20PROJEKTU%20STABILIZACJA%20I%20UGRUNTOWANIE) — tam znajdują się wskazówki instalacyjne i kontekst.

Jeśli zaktualizujesz ten plik
- Zachowaj zwięzły, praktyczny styl. Dodawaj tylko fakty możliwe do zweryfikowania z repo lub podane przez użytkownika.

Pytania do użytkownika
- Czy chcesz, aby odpowiedzi agenta i nowe pliki były zawsze po polsku?
- Czy mam zainicjować strukturę projektu (napisz preferowany runtime), czy tylko uaktualnić dokumentację?

CI i scaffold — szybkie sugestie
- Proponowany minimalny workflow: dodajemy prosty GitHub Actions, który robi `checkout` i uruchamia walidację Markdown/lint (`github/super-linter`). Plik przykładowy: `.github/workflows/validate.yml`.
- Jeśli chcesz scaffold: podaj preferowany runtime; poniżej przykładowe kroki dla trzech popularnych stacków.

Przykładowy scaffold (szybki start)
- Node.js
	- Inicjalizacja: `npm init -y`
	- Minimalne pliki: `package.json`, `index.js`, `.gitignore` (node_modules)
	- Przydatne polecenia: `npm install --save-dev eslint markdownlint-cli`
	- CI: użyj `actions/setup-node` + `npm ci` + `npm run lint`.
- Python
	- Inicjalizacja: `python -m venv .venv` i `pip install -r requirements.txt`
	- Minimalne pliki: `requirements.txt`, `src/`, `tests/`
	- CI: `actions/setup-python` + `pip install -r requirements.txt` + `pytest`.
- .NET (dotnet)
	- Inicjalizacja: `dotnet new console -o src` i `dotnet new sln` + `dotnet sln add src`
	- CI: `actions/setup-dotnet` + `dotnet build` + `dotnet test`.

Konwencje repozytorium (szczegóły)
- Kodowanie: domyślnie UTF-8 bez BOM.
- Nazwy plików: zachowuj spacje jeśli już istnieją, ale przy tworzeniu nowych preferuj `-` lub `_` zamiast spacji.
- Zakończenia linii: na Windows preferowane CRLF w plikach tekstowych; w CI można wymusić LF. Zapytaj użytkownika jeśli wymagana jest koherentna polityka.
- Branching/commit: domyślnie `main` jako branch główny; komity w stylu `feat:`, `fix:`, `docs:` są preferowane (lightweight conventional commits).
- Język komunikacji: pytaj — repozytorium ma polski tytuł, więc preferencja może być polska.

Pliki do dodania (opcjonalnie)
- `.github/workflows/validate.yml` — podstawowy workflow lintujący markdown i pliki tekstowe.

Co dalej
- Mogę: (A) utworzyć przykładowy workflow `.github/workflows/validate.yml`, (B) wygenerować scaffold dla wybranego runtime (Node/Python/dotnet), (C) wprowadzić pełne reguły konwencji w `.github/copilot-instructions.md`.
- Wybierz opcję (A/B/C) lub poproś o wszystkie (A+B+C).

Demo scaffold (co zostało dodane)
- Dodałem minimalny scaffold Node.js i prosty demo serwer.
- Kluczowe pliki: `package.json`, `index.js`, `public/index.html`, `scripts/pack.js`, `README_DEMO.md`.
- Uruchamianie (w katalogu repo):

```bash
npm install
npm start
# otwórz http://localhost:3000
npm run pack
# wygeneruje demo.zip w katalogu repo
```

- Skrypt `pack` tworzy `demo.zip` zawierający `index.js`, `package.json`, `public/` i `README_DEMO.md`.

Jeśli chcesz, mogę wygenerować scaffold dla innego runtime (Python/.NET) lub dodać automatyczne testy uruchamiające demo w CI.

Zawsze: run_lint → run_typecheck → run_tests → run_security_scan

Jeśli coś padnie:

agent naprawia minimalnie

odpala checki ponownie

dopiero potem PR

W PR wrzuca:

wyniki (ok/exitCode) i skrót błędów (z summarize_failures)

listę plików zmienionych

ryzyka

Efekt:= Dostaje praktycznie tylko raport + gotowy PR
