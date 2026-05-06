# run-tests.ps1
# Detects whether frontend or backend files changed since the last commit,
# runs the appropriate test suite(s), and outputs results as a systemMessage.
# Uses a sentinel file to avoid re-running within 5 minutes of the last run.

$sentinel = '.claude\.last-test-run'

if (Test-Path $sentinel) {
    $age = ((Get-Date) - (Get-Item $sentinel).LastWriteTime).TotalMinutes
    if ($age -lt 5) { exit 0 }
}

# Collect all changed file paths (vs last commit + untracked)
$tracked   = @(git diff --name-only HEAD 2>$null)
$untracked = @(git ls-files --others --exclude-standard 2>$null)
$changed   = ($tracked + $untracked) | Where-Object { $_ -ne '' } | Select-Object -Unique

$fChanged = ($changed | Where-Object { $_ -like 'frontend/*' } | Measure-Object).Count -gt 0
$bChanged = ($changed | Where-Object { $_ -like 'backend/*'  } | Measure-Object).Count -gt 0

if (-not $fChanged -and -not $bChanged) { exit 0 }

# Mark that tests are running now
Set-Content -Path $sentinel -Value ''

$messages  = [System.Collections.Generic.List[string]]::new()
$anyFailed = $false

function Invoke-Tests {
    param([string]$Area, [string]$Dir)

    if (-not (Test-Path "$Dir\package.json")) {
        $messages.Add("$Area files changed — $Dir/package.json not found, tests skipped.")
        return
    }

    Push-Location $Dir
    $out    = npm test 2>&1 | ForEach-Object { "$_" }
    $passed = $LASTEXITCODE -eq 0
    Pop-Location

    if ($passed) {
        $messages.Add("$Area tests: PASSED")
    } else {
        # Include the last 40 lines to stay within reasonable systemMessage size
        $tail = ($out | Select-Object -Last 40) -join "`n"
        $messages.Add("${Area} tests: FAILED`n${tail}")
        $script:anyFailed = $true
    }
}

if ($fChanged) { Invoke-Tests -Area 'Frontend' -Dir 'frontend' }
if ($bChanged) { Invoke-Tests -Area 'Backend'  -Dir 'backend'  }

if ($messages.Count -gt 0) {
    $body = $messages -join "`n`n"
    Write-Output ([PSCustomObject]@{ systemMessage = $body } | ConvertTo-Json -Compress)
}

exit $(if ($anyFailed) { 1 } else { 0 })
