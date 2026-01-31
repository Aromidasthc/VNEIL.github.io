#!/usr/bin/env bash
# VNEIL OS Repository Initialization Script
# Purpose: Automate the setup of a new VNEIL OS repository
# Usage: ./scripts/init-vneil-os.sh [repository-url]
# Example: ./scripts/init-vneil-os.sh git@github.com:VERTYXNEXUSEIL/vertyxnexus-os.git

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install git first."
        exit 1
    fi
    print_info "Git found: $(git --version)"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_warn "Not in a git repository. Initializing..."
        git init
        print_info "Git repository initialized"
    else
        print_info "Already in a git repository"
    fi
}

# Function to check working tree status
check_working_tree() {
    if [[ -n $(git status --porcelain) ]]; then
        print_warn "Working tree has uncommitted changes"
        return 1
    else
        print_info "Working tree is clean"
        return 0
    fi
}

# Function to add and commit files
add_and_commit() {
    local commit_message="${1:-VNEIL OS initial}"
    
    if check_working_tree; then
        print_info "No changes to commit"
        return 0
    fi
    
    # Check for .gitignore
    if [[ ! -f .gitignore ]]; then
        print_warn "No .gitignore file found. You may accidentally commit sensitive files."
        read -p "Continue? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Aborted. Please create a .gitignore file first."
            exit 1
        fi
    fi
    
    print_info "Adding all files to git..."
    # Use git add -A to stage all changes from repository root
    git add -A
    
    # Show what will be committed
    print_info "Files to be committed:"
    git status --short
    echo
    
    read -p "Proceed with commit? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Commit cancelled"
        exit 1
    fi
    
    print_info "Creating commit: $commit_message"
    git commit -m "$commit_message"
    
    print_info "Commit created successfully"
}

# Function to ensure main branch
ensure_main_branch() {
    # Check if we have any commits
    if ! git rev-parse HEAD &> /dev/null; then
        print_warn "No commits yet. Skipping branch rename (will be named 'main' on first commit)"
        return 0
    fi
    
    local current_branch=$(git branch --show-current)
    
    if [[ "$current_branch" == "main" ]]; then
        print_info "Already on main branch"
    else
        print_info "Renaming branch to 'main'..."
        git branch -M main
        print_info "Branch renamed to 'main'"
    fi
}

# Function to configure remote
configure_remote() {
    local remote_url="$1"
    
    if git remote get-url origin &> /dev/null; then
        local existing_url=$(git remote get-url origin)
        print_warn "Remote 'origin' already exists: $existing_url"
        
        read -p "Do you want to update it to $remote_url? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git remote set-url origin "$remote_url"
            print_info "Remote updated to: $remote_url"
        else
            print_info "Keeping existing remote"
        fi
    else
        print_info "Adding remote 'origin': $remote_url"
        git remote add origin "$remote_url"
        print_info "Remote added successfully"
    fi
}

# Function to push to remote
push_to_remote() {
    print_info "Pushing to remote repository..."
    
    if git push -u origin main; then
        print_info "Successfully pushed to origin/main"
        return 0
    else
        print_error "Failed to push. Check your credentials and permissions."
        print_warn "You can push manually later with: git push -u origin main"
        return 0  # Don't fail the script, allow it to complete
    fi
}

# Main execution
main() {
    echo "========================================="
    echo "  VNEIL OS Repository Initialization"
    echo "========================================="
    echo ""
    
    # Step 1: Check prerequisites
    print_info "Step 1/6: Checking prerequisites..."
    check_git
    echo ""
    
    # Step 2: Initialize or verify git repository
    print_info "Step 2/6: Initializing git repository..."
    check_git_repo
    echo ""
    
    # Step 3: Add and commit files
    print_info "Step 3/6: Adding and committing files..."
    add_and_commit "VNEIL OS initial"
    echo ""
    
    # Step 4: Ensure main branch
    print_info "Step 4/6: Ensuring main branch..."
    ensure_main_branch
    echo ""
    
    # Step 5: Configure remote
    print_info "Step 5/6: Configuring remote repository..."
    if [[ $# -eq 0 ]]; then
        print_warn "No remote URL provided"
        read -p "Enter remote repository URL (or press Enter to skip): " remote_url
        if [[ -n "$remote_url" ]]; then
            configure_remote "$remote_url"
        else
            print_warn "Skipping remote configuration"
        fi
    else
        configure_remote "$1"
    fi
    echo ""
    
    # Step 6: Push to remote
    if git remote get-url origin &> /dev/null; then
        print_info "Step 6/6: Pushing to remote..."
        read -p "Push to remote now? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            push_to_remote
        else
            print_info "Skipping push. You can push later with: git push -u origin main"
        fi
    else
        print_warn "Step 6/6: Skipped (no remote configured)"
    fi
    
    echo ""
    echo "========================================="
    print_info "VNEIL OS initialization complete!"
    echo "========================================="
    echo ""
    print_info "Next steps:"
    echo "  1. Review changes: git log"
    echo "  2. Update package.json with repository info"
    echo "  3. Run: npm install"
    echo "  4. Run: npm test"
    echo "  5. Read: VNEIL-OS-SETUP.md"
}

# Run main function
main "$@"
