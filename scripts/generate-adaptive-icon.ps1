Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\Logo\icon.png"
$outPath = Join-Path $PSScriptRoot "..\Logo\adaptive-icon.png"

$src = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source image size: $($src.Width) x $($src.Height)"

# Para adaptive icon padrão do Android, usamos um canvas de 512x512 ou 1024x1024.
# O logo deve ocupar aproximadamente 56% do canvas (área segura de 66%),
# deixando aproximadamente 22% de margem transparente por lado.
$canvasSize = 512
$targetLogoSize = [int]($canvasSize * 0.56) # ~286px
$offset = [int](($canvasSize - $targetLogoSize) / 2) # ~113px margem em cada lado (~22%)

Write-Host "Canvas: $canvasSize x $canvasSize | Logo central: $targetLogoSize x $targetLogoSize | Margem: $offset px (22%)"

$destBmp = New-Object System.Drawing.Bitmap($canvasSize, $canvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($destBmp)

$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

$destRect = New-Object System.Drawing.Rectangle($offset, $offset, $targetLogoSize, $targetLogoSize)
$srcRect = New-Object System.Drawing.Rectangle(0, 0, $src.Width, $src.Height)

$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$destBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$destBmp.Dispose()
$src.Dispose()

Write-Host "Adaptive icon gerado com sucesso em: $outPath"
