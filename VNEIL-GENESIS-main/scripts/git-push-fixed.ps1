param(
  [string]$Branch = "feat/demo-scaffold",
  [string]$CommitMessage = "chore: add demo scaffolds, CI, packaging and instructions",
  [string]$RemoteUrl = "",
  [switch]$Force
)

function Ensure-Git {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git not found. Installing via winget..." -ForegroundColor Yellow
    Start-Process -FilePath winget -ArgumentList 'install --id Git.Git -e --source winget' -NoNewWindow -Wait
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
      Write-Error "Git install failed. Please install manually."
      exit 1
    }
  }
}

function Ensure-GitConfig {
  $name = (& git config --global user.name) -join ""
  $email = (& git config --global user.email) -join ""
  if (-not $name) {
    $name = Read-Host "Enter git user.name"
    & git config --global user.name "$name"
  }
  if (-not $email) {
    $email = Read-Host "Enter git user.email"
    & git config --global user.email "$email"
  }
}

function Run-GitPush {
  $status = & git status --porcelain
  if (-not $status -and -not $Force) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
    return
  }

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
  & git commit -m "$CommitMessage" -ErrorAction SilentlyContinue

  $origin = (& git remote get-url origin 2>$null) -join ""
  if (-not $origin) {
    if ($RemoteUrl) {
      & git remote add origin $RemoteUrl
      $origin = $RemoteUrl
    } else {
      Write-Host "Remote 'origin' not configured. Use -RemoteUrl or set it manually." -ForegroundColor Red
      return
    }
  }

  Write-Host "Pushing to $origin on branch $Branch..." -ForegroundColor Green
  & git push -u origin $Branch
  Write-Host "Done!" -ForegroundColor Green
}

Ensure-Git
Ensure-GitConfig
Run-GitPush
