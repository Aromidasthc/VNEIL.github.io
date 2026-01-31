# VNEIL OS Initial Setup Guide

This document provides step-by-step instructions for initializing a VNEIL OS repository.

## Prerequisites

- Git installed on your system
- SSH key configured with GitHub (for SSH remote) or GitHub credentials (for HTTPS)
- Access to the target repository

## Initial Repository Setup

### Option 1: New Repository Initialization

If you're starting a fresh VNEIL OS project:

```bash
# Navigate to your project directory
cd your-vneil-os-project

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "VNEIL OS initial"

# Rename branch to main (if not already)
git branch -M main

# Add remote repository (SSH)
git remote add origin git@github.com:VERTYXNEXUSEIL/vertyxnexus-os.git

# Or add remote repository (HTTPS)
# git remote add origin https://github.com/VERTYXNEXUSEIL/vertyxnexus-os.git

# Push to remote
git push -u origin main
```

### Option 2: Fork from VNEIL-GENESIS

If you're creating a VNEIL OS project based on this template:

```bash
# Clone this repository
git clone https://github.com/VERTYXNEXUSEIL/VNEIL-GENESIS.git your-vneil-os-project
cd your-vneil-os-project

# Remove the original remote
git remote remove origin

# Add your new repository as origin
git remote add origin git@github.com:VERTYXNEXUSEIL/vertyxnexus-os.git

# Create initial commit (if you made changes)
git add .
git commit -m "VNEIL OS initial"

# Ensure you're on main branch
git branch -M main

# Push to your new repository
git push -u origin main
```

## Post-Setup Configuration

After initial setup, configure your repository:

### 1. Update Repository Information

Edit `package.json`:
```json
{
  "name": "vneil-os",
  "version": "0.1.0",
  "description": "VNEIL Operating System - TSVNE Compliant",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/VERTYXNEXUSEIL/vertyxnexus-os.git"
  }
}
```

### 2. Configure TSVNE Compliance

Ensure your project follows TSVNE principles:
- ✅ Deterministic behavior
- ✅ Auditable operations
- ✅ Compliance-first approach
- ✅ Minimal dependencies

See [TSVNE-SYSTEM.md](TSVNE-SYSTEM.md) for detailed guidelines.

### 3. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up git hooks
./scripts/setup-hooks.sh

# Run tests
npm test

# Start development server
npm start
```

## Git Workflow Best Practices

### Branch Naming Convention

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/` - New features (e.g., `feature/vneil-core`)
- `fix/` - Bug fixes (e.g., `fix/memory-leak`)
- `docs/` - Documentation updates

### Commit Message Convention

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring

Example:
```bash
git commit -m "feat: add VNEIL OS core initialization module"
git commit -m "fix: resolve memory leak in ECG controller"
git commit -m "docs: update VNEIL OS architecture diagram"
```

## Troubleshooting

### Permission Denied (SSH)

If you get "Permission denied" when pushing via SSH:

```bash
# Verify SSH key is added to ssh-agent
ssh-add -l

# Add your SSH key if needed
ssh-add ~/.ssh/id_rsa

# Test SSH connection
ssh -T git@github.com
```

### Branch Already Exists

If the branch already exists on remote:

```bash
# Force push (use carefully!)
git push -u origin main --force

# Or, pull first and merge
git pull origin main --rebase
git push -u origin main
```

### Wrong Remote URL

To change the remote URL:

```bash
# View current remote
git remote -v

# Change remote URL
git remote set-url origin git@github.com:VERTYXNEXUSEIL/vertyxnexus-os.git

# Verify the change
git remote -v
```

## Repository Structure

After setup, your VNEIL OS repository should have:

```
vertyxnexus-os/
├── .github/           # CI/CD workflows
├── api/              # Serverless functions
├── public/           # Static assets
├── scripts/          # Build and utility scripts
├── src/              # Source code
├── tests/            # Test suites
├── .gitignore        # Git ignore rules
├── package.json      # Dependencies
├── README.md         # Project documentation
└── TSVNE-SYSTEM.md   # TSVNE compliance guide
```

## Security Considerations

Before pushing to a remote repository:

1. ✅ Review `.gitignore` to exclude sensitive files
2. ✅ Remove any hardcoded credentials or API keys
3. ✅ Scan for security vulnerabilities: `npm audit`
4. ✅ Ensure no personal data is committed
5. ✅ Review commit history for sensitive information

## Next Steps

After successful initial setup:

1. 📖 Read [TSVNE-DEVELOPER-GUIDE.md](TSVNE-DEVELOPER-GUIDE.md)
2. 🔧 Configure deployment (see [DEPLOYMENT.md](DEPLOYMENT.md))
3. 📝 Update project documentation
4. ✅ Set up CI/CD workflows
5. 🧪 Add comprehensive tests

## Support

For issues or questions:
- Create an issue in this repository
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Review [SECURITY.md](SECURITY.md) for security policies

---

**VNEIL OS** - Built with TSVNE Principles
- Deterministic ✓
- Auditable ✓
- Compliance-first ✓
- Minimal ✓
