#!/bin/bash
# Setup script for VNEIL-GENESIS Git Hooks
# Installs pre-commit hooks for automatic validation

echo "🔧 Setting up VNEIL-GENESIS Git Hooks..."

# Check if .git directory exists
if [ ! -d ".git" ]; then
  echo "❌ Error: Not a git repository. Run this from the repository root."
  exit 1
fi

# Configure git to use .git-hooks directory
git config core.hooksPath .git-hooks

echo "✅ Git hooks configured successfully!"
echo ""
echo "Pre-commit hook will now run automatically before each commit:"
echo "  - TSVNE tests (52 tests)"
echo "  - TSVNE compliance validation"
echo "  - ESLint (if configured)"
echo ""
echo "To skip hooks temporarily, use: git commit --no-verify"
