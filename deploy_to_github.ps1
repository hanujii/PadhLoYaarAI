
# Deploy to GitHub Script
Write-Host "Starting Deployment..." -ForegroundColor Green

# Check for Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not in your PATH."
    exit 1
}

# Initialize if needed
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git..."
    git init
}

# Add and Commit
Write-Host "Staging files..."
git add .
Write-Host "Committing..."
git commit -m "Padh Lo Yaar: Initial Commit with Enhancements"

# Create Repo via GH CLI if available
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "Creating GitHub Repository..."
    gh repo create "padh-lo-yaar" --public --source=. --remote=origin --push
} else {
    Write-Warning "GitHub CLI (gh) not found."
    Write-Host "Please create a repository on GitHub manually."
    Write-Host "Then run:"
    Write-Host "  git remote add origin <URL>"
    Write-Host "  git branch -M main"
    Write-Host "  git push -u origin main"
}
