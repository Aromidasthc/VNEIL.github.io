# Contributing to VNEIL-GENESIS

Thank you for your interest in contributing to VNEIL-GENESIS! This document provides guidelines for contributing to the project.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please create an issue describing:
- The feature and its use case
- Why it would be valuable
- Possible implementation approaches

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow coding standards**:
   - Run `npm run lint` before committing
   - Run `npm run format` to format code
   - Ensure all tests pass: `npm test`
3. **Write clear commit messages**:
   - Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
   - Be descriptive but concise
4. **Add tests** for new features
5. **Update documentation** if needed
6. **Run pre-commit hooks**: `./scripts/setup-hooks.sh`

### Development Setup

```bash
# Clone the repository
git clone https://github.com/VERTYXNEXUSEIL/VNEIL-GENESIS.git
cd VNEIL-GENESIS

# Install dependencies
npm install

# Set up git hooks
./scripts/setup-hooks.sh

# Run tests
npm test

# Start local server
npm start
```

### Coding Standards

- **TSVNE Principles**: Follow deterministic, auditable, compliance-first approach
- **Code Style**: Use ESLint and Prettier configurations
- **Documentation**: Comment complex logic, update README for significant changes
- **Testing**: Maintain test coverage, all tests must pass
- **Security**: Never commit secrets, follow security best practices

### TSVNE Compliance

When modifying TSVNE modules:
- Maintain deterministic behavior (same input → same output)
- Fail-fast with explicit error messages
- No hidden state or side effects
- Document assumptions, invariants, and failure modes
- Include practical examples

### Project Structure

```
VNEIL-GENESIS/
├── api/               # Vercel serverless functions
├── public/            # Static website files
├── scripts/           # Build and utility scripts
├── .github/           # GitHub workflows and configurations
├── *.test.js          # Test files
├── index.js           # Local development server
└── package.json       # Dependencies and scripts
```

### Testing

- Run all tests: `npm test`
- Run specific test: `npm run test:validator`
- Tests use vanilla Node.js (no framework)
- Aim for 100% coverage on critical paths

### Documentation

- Keep README.md up to date
- Update OPIS-STANU.md for significant changes
- Add inline comments for complex logic
- Update CHANGELOG.md following Keep a Changelog format

### Deployment

- Vercel is the recommended deployment platform
- See INSTRUKCJA-WDROZENIA.md for deployment instructions
- Test on Vercel preview deployments before merging

## Questions?

Feel free to create an issue for questions or discussions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
