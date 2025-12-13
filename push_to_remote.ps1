
# Manual Deployment Helper
param(
    [Parameter(Mandatory = $true)]
    [string]$RepoUrl
)

$GitPath = "C:\Program Files\Git\cmd\git.exe"

if (-not (Test-Path $GitPath)) {
    Write-Error "Git not found at $GitPath"
    exit 1
}

Write-Host "Adding remote origin: $RepoUrl"
& $GitPath remote add origin $RepoUrl

Write-Host "Renaming branch to main..."
& $GitPath branch -M main

Write-Host "Pushing to remote..."
& $GitPath push -u origin main

Write-Host "Done!"
