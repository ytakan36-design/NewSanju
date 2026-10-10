# Local preview for the Sanju static site.
# Open http://127.0.0.1:8765/ and stop with Ctrl+C.
$ErrorActionPreference = "Stop"
$port = 8765
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://127.0.0.1:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try {
  $listener.Start()
} catch {
  Write-Host "Could not listen on $prefix"
  Write-Host $_
  exit 1
}
Write-Host "Sanju local site: $prefix"
Write-Host "Stop with Ctrl+C"
$types = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".png"  = "image/png"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
}
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)
    if ($rel -eq "/") { $rel = "/index.html" }
    $rel = $rel.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
    if ($rel.Contains("..")) {
      $context.Response.StatusCode = 400
      $context.Response.Close()
      continue
    }
    $file = Join-Path $root $rel
    $ok = (Test-Path -LiteralPath $file) -and -not (Get-Item -LiteralPath $file).PSIsContainer
    if ($ok) {
      $bytes = [IO.File]::ReadAllBytes($file)
      $ext = [IO.Path]::GetExtension($file).ToLowerInvariant()
      $context.Response.StatusCode = 200
      $context.Response.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" })
    } else {
      $context.Response.StatusCode = 404
      $fallback = Join-Path $root "404.html"
      if (Test-Path -LiteralPath $fallback) {
        $bytes = [IO.File]::ReadAllBytes($fallback)
        $context.Response.ContentType = "text/html; charset=utf-8"
      } else {
        $bytes = [Text.Encoding]::UTF8.GetBytes("Not found")
        $context.Response.ContentType = "text/plain; charset=utf-8"
      }
    }
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()
  }
} finally {
  if ($listener.IsListening) { $listener.Stop() }
  $listener.Close()
}
