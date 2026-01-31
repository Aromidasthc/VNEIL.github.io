# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive state analysis document (OPIS-STANU.md)
- Production deployment configurations for 5 platforms (Vercel, Netlify, Railway, Render, GitHub Pages)
- CI/CD pipeline with GitHub Actions (testing, linting, security audits)
- Code quality tools (ESLint, Prettier)
- Pre-commit hooks for automated validation
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy)
- Vercel serverless architecture with proper static file serving
- Comprehensive deployment documentation (INSTRUKCJA-WDROZENIA.md, WDROZENIE-PODSUMOWANIE.md)
- Quality infrastructure documentation (ULEPSZENIA-KODU.md)
- Vercel troubleshooting guides (VERCEL-FIX-EXPLANATION.md, VERCEL-FIX-V2.md)

### Fixed
- Vercel FUNCTION_INVOCATION_FAILED errors (removed app.listen(), express.static())
- Security headers now applied globally via vercel.json
- Static files properly served via Vercel CDN
- Serverless function optimized for API endpoints only

### Changed
- Migrated security headers from Express middleware to Vercel edge configuration
- Optimized routing strategy for static files and API endpoints
- Simplified api/index.js by removing unnecessary middleware

## [0.1.0] - 2026-01-27

### Added
- Initial VNEIL-GENESIS repository structure
- TSVNE (Template-based Simple Validation and Normalization Engine) system
- Futuristic website design (www.vertyxnexus.pl)
- TSVNE validator with 52 passing tests
- Multi-runtime demo scaffolds (Node.js, Python, .NET)
- Basic Express server for local development
- Comprehensive documentation in Polish

[Unreleased]: https://github.com/Aromidasthc/VNEIL-GENESIS/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Aromidasthc/VNEIL-GENESIS/releases/tag/v0.1.0
