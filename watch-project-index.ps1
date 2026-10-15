param(
  [switch]$Once
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$indexPath = Join-Path $root "index.html"
$legacyIndexPath = Join-Path $root "webprogramming webpae.html"

function Get-WeekCode([string]$folderName) {
  $codes = @{
    week_1 = "01"
    week2_1 = "02A"
    week2_2 = "02B"
    week3_1 = "03A"
    week3_2 = "03B"
    week4_1 = "04"
    week5 = "05"
  }
  if ($codes.ContainsKey($folderName)) { return $codes[$folderName] }
  return ($folderName -replace "[^0-9]", "")
}

function Get-WeekTitle([string]$folderName) {
  $separator = [string][char]0x00B7
  $titles = @{
    week_1 = "Week 1"
    week2_1 = "Week 2 $separator Part 1"
    week2_2 = "Week 2 $separator Part 2"
    week3_1 = "Week 3 $separator Part 1"
    week3_2 = "Week 3 $separator Part 2"
    week4_1 = "Week 4 $separator Part 1"
    week5 = "Week 5"
  }
  if ($titles.ContainsKey($folderName)) { return $titles[$folderName] }
  $words = ($folderName -replace "[_-]+", " ").ToLowerInvariant()
  return (Get-Culture).TextInfo.ToTitleCase($words)
}

function Get-TaskLabel([string]$fileName) {
  $name = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
  if ($name -match "^task\s*(\d+)$") { return "Task $($Matches[1])" }
  if ($name -ieq "trial") { return "Trial page" }
  if ($name -ieq "counter") { return "Counter" }
  if ($name -ieq "grade calculator") { return "Grade Calculator" }
  $words = ($name -replace "[-_]+", " " -replace "\s+", " ").Trim().ToLowerInvariant()
  return (Get-Culture).TextInfo.ToTitleCase($words)
}

function Get-WeekOrder([string]$folderName) {
  $order = @{
    week_1 = 1
    week2_1 = 2
    week2_2 = 3
    week3_1 = 4
    week3_2 = 5
    week4_1 = 6
    week5 = 7
  }
  if ($order.ContainsKey($folderName)) { return $order[$folderName] }
  return 99
}

function Replace-MarkedBlock([string]$content, [string]$startMarker, [string]$endMarker, [string]$replacement) {
  $start = $content.IndexOf($startMarker, [System.StringComparison]::Ordinal)
  if ($start -lt 0) { throw "Missing marker: $startMarker" }
  $end = $content.IndexOf($endMarker, $start + $startMarker.Length, [System.StringComparison]::Ordinal)
  if ($end -lt 0) { throw "Missing marker: $endMarker" }
  return $content.Substring(0, $start) + $replacement + $content.Substring($end + $endMarker.Length)
}

function Set-ElementText([string]$content, [string]$id, [string]$text) {
  $pattern = "(<[^>]+\bid=""$([regex]::Escape($id))""[^>]*>).*?(</[^>]+>)"
  $match = [regex]::Match($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if (-not $match.Success) { throw "Could not find element with id '$id'." }
  $encodedText = [System.Net.WebUtility]::HtmlEncode($text)
  return $content.Substring(0, $match.Index) + $match.Groups[1].Value + $encodedText + $match.Groups[2].Value + $content.Substring($match.Index + $match.Length)
}

function Get-ProjectWeeks {
  $folders = @(Get-ChildItem -LiteralPath $root -Directory | Where-Object { $_.Name -match "^week" } | Sort-Object @{ Expression = { Get-WeekOrder $_.Name } }, Name)
  $weeks = @()
  foreach ($folder in $folders) {
    $files = @(Get-ChildItem -LiteralPath $folder.FullName -File | Where-Object { $_.Extension -match "^\.(html?|htm)$" } | Sort-Object Name)
    if ($files.Count -gt 0) {
      $weeks += [pscustomobject]@{
        folder = $folder.Name
        code = Get-WeekCode $folder.Name
        title = Get-WeekTitle $folder.Name
        files = $files
      }
    }
  }
  return $weeks
}

function Update-ProjectIndexes {
  $weeks = @(Get-ProjectWeeks)
  $separator = [string][char]0x00B7
  $total = 0
  foreach ($week in $weeks) { $total += $week.files.Count }

  $configData = @($weeks | ForEach-Object {
    [pscustomobject]@{
      folder = $_.folder
      code = $_.code
      title = $_.title
      tasks = @($_.files | ForEach-Object { $_.Name })
    }
  })
  $config = ConvertTo-Json -InputObject $configData -Depth 5
  $index = [System.IO.File]::ReadAllText($indexPath)
  $configBlock = "// BEGIN GENERATED PROJECT DATA`r`n    const weekConfig = $config;`r`n    // END GENERATED PROJECT DATA"
  $index = Replace-MarkedBlock $index "// BEGIN GENERATED PROJECT DATA" "// END GENERATED PROJECT DATA" $configBlock
  [System.IO.File]::WriteAllText($indexPath, $index, (New-Object System.Text.UTF8Encoding($false)))

  $details = foreach ($week in $weeks) {
    $links = foreach ($file in $week.files) {
      $href = [System.Uri]::EscapeDataString($week.folder) + "/" + [System.Uri]::EscapeDataString($file.Name)
      $label = [System.Net.WebUtility]::HtmlEncode((Get-TaskLabel $file.Name))
      "            <a class=""task-link"" href=""$href"">$label</a>"
    }
    $countLabel = if ($week.files.Count -eq 1) { "project" } else { "projects" }
    @"
        <details class="week" data-week>
          <summary><span class="week-number">$($week.code)</span><span class="week-title">$([System.Net.WebUtility]::HtmlEncode($week.title))</span><span class="week-count">$($week.files.Count) $countLabel</span><span class="chevron" aria-hidden="true"></span></summary>
          <div class="task-grid">
$($links -join "`r`n")
          </div>
        </details>
"@
  }

  $legacy = [System.IO.File]::ReadAllText($legacyIndexPath)
  $linksBlock = "<!-- BEGIN GENERATED PROJECT LINKS -->`r`n$($details -join "`r`n")        <!-- END GENERATED PROJECT LINKS -->"
  $legacy = Replace-MarkedBlock $legacy "<!-- BEGIN GENERATED PROJECT LINKS -->" "<!-- END GENERATED PROJECT LINKS -->" $linksBlock
  $legacy = Set-ElementText $legacy "result-count" "$total projects $separator $($weeks.Count) weeks"
  $legacy = Set-ElementText $legacy "footer-total" "Project index $separator $total tasks"
  [System.IO.File]::WriteAllText($legacyIndexPath, $legacy, (New-Object System.Text.UTF8Encoding($false)))

  Write-Host "Updated both project indexes: $total HTML files across $($weeks.Count) week folders."
}

Update-ProjectIndexes
if ($Once) { return }

$previousSnapshot = @((Get-ProjectWeeks | ForEach-Object { $_.files | ForEach-Object { $_.FullName } }) | Sort-Object) -join "`n"
Write-Host "Watching week folders for added, removed, or renamed HTML files. Press Ctrl+C to stop."
while ($true) {
  Start-Sleep -Seconds 1
  $currentSnapshot = @((Get-ProjectWeeks | ForEach-Object { $_.files | ForEach-Object { $_.FullName } }) | Sort-Object) -join "`n"
  if ($currentSnapshot -ne $previousSnapshot) {
    Update-ProjectIndexes
    $previousSnapshot = $currentSnapshot
  }
}
