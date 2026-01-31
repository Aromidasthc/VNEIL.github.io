<#
Usage:
  .\scripts\git-push.ps1 [-Branch feat/demo-scaffold] [-CommitMessage "message"] [-RemoteUrl "https://..."] [-Force]

What it does:
 - Checks for `git`, installs via winget if missing (interactive elevation may be required).
 - Ensures `user.name` and `user.email` are configured (prompts if missing).
 - Creates/checkout a branch, stages changes, commits, and pushes to `origin` (or adds `origin` if `-RemoteUrl` provided).
#>

param(
  [string]$Branch = "feat/demo-scaffold",
  [string]$CommitMessage = "chore: add demo scaffolds, CI, packaging and instructions",
  [string]$RemoteUrl = "",
  [switch]$Force
)

function Ensure-Git {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git nie jest zainstalowany. Próba instalacji przez winget..." -ForegroundColor Yellow
    try {
      Start-Process -FilePath winget -ArgumentList 'install --id Git.Git -e --source winget' -NoNewWindow -Wait
    } catch {
      Write-Error "Nie udało się zainstalować Git. Zainstaluj go ręcznie i uruchom skrypt ponownie."
      exit 1
    }
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
      Write-Error "Git nadal nie jest dostępny po instalacji. Sprawdź PATH i uruchom ponownie terminal."
      exit 1
    }
  }
}

function Ensure-GitConfig {
  $name = (& git config --global user.name) -join ""
  $email = (& git config --global user.email) -join ""
  if (-not $name) {
    $name = Read-Host "Wprowadź git user.name (np. Twoje Imię)"
    & git config --global user.name "$name"
  }
  if (-not $email) {
    $email = Read-Host "Wprowadź git user.email (np. email@example.com)"
    & git config --global user.email "$email"
  }
}

function Run-GitPush {
  $status = & git status --porcelain
  if (-not $status -and -not $Force) {
    Write-Host "Brak zmian do zatwierdzenia (nothing to commit)." -ForegroundColor Yellow
    return
  }

  # create or switch branch
  $current = (& git rev-parse --abbrev-ref HEAD) -join ""
  if ($current -ne $Branch) {
    $exists = (& git branch --list $Branch) -join ""
    if ($exists) {
      & git checkout $Branch
    } else {
      & git checkout -b $Branch
    }
  }

  & git add .

  try {
    & git commit -m "$CommitMessage"
  } catch {
    Write-Host "Commit nie powiódł się — możliwe, że nie było zmian do zatwierdzenia." -ForegroundColor Yellow
  }

  # check remote
  $origin = (& git remote get-url origin 2>$null) -join ""
  if (-not $origin) {
    if ($RemoteUrl) {
      & git remote add origin $RemoteUrl
      $origin = $RemoteUrl
    } else {
      Write-Host "Remote 'origin' nie jest skonfigurowany. Podaj URL remote lub uruchom skrypt z parametrem -RemoteUrl." -ForegroundColor Red
      return
    }
  }

  Write-Host "Pushing to $origin on branch $Branch..."
  & git push -u origin $Branch
}

# Script start
Set-StrictMode -Version Latest
Ensure-Git
Ensure-GitConfig
Run-GitPush
