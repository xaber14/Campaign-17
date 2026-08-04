# ==========================================================================
# Bangun assets/img/hero-bg-tema2.jpg — latar Hero untuk Tema 2.
# Figma: node 16:4171 (file BbdQ2sSITixKR7raGXSOw5 "Backup Kuis 17an").
#
# Jalankan dari root folder proyek:
#   powershell -NoProfile -ExecutionPolicy Bypass -File "tools/build-hero-tema2.ps1"
#
# --- RIWAYAT: kenapa skrip ini ditulis ulang (4 Agustus 2026) --------------
# Versi sebelumnya menempel dua PNG yang SUDAH ter-render gradient-nya dari
# Figma (per node, @2x) ke kanvas 1440x740, karena menghitung gradient
# ber-sudut dianggap terlalu rawan. Pendekatan itu punya dua masalah:
#   1. rapuh — file sumbernya sempat hilang dari root folder, dan sekali hilang
#      latar ini tidak bisa dibangun ulang sama sekali;
#   2. terkunci di 740px — desainnya kemudian direvisi jadi Hero 810px, dan
#      di kanvas 740 tombol "Ikuti Kuis Dengar Stori" di dalam mockup HP
#      selalu jatuh di zona `.hero__blend`. Digeser ke atas biar tombolnya
#      lolos, puncak HP-nya yang kepotong navbar — memang tidak cukup ruang.
#
# Sekarang skrip menyusun latar dari layer MENTAH (tanpa gradient) dan
# menghitung sendiri kedua gradient overlay-nya dari spek Figma, persis seperti
# CSS `linear-gradient()`. Konsekuensinya positif: tinggi frame, posisi layer,
# dan gradient semuanya jadi parameter di sini — revisi desain berikutnya cukup
# ubah angka, tidak perlu export ulang per node.
#
# Aset sumber (di root folder, diunduh dari Figma asset server node 16:4171):
#   Asset Hero 2.png       1536x1024  fill node 16:4172 — foto massa "INDONESIA MERDEKA"
#   Asset Hero Kolase.png  1672x941   fill node 16:4174 ("image 365") — kolase Proklamasi
#   Asset Hero HP.png      3920x3500  fill node 16:4175 ("Rectangle") — mockup HP, PUNYA ALPHA
#
# Catatan: `Asset Hero Section Kanan.png` (export flattened kolase+HP yang
# dipakai versi skrip lama) sudah TIDAK dipakai lagi — HP dan kolase sekarang
# dua layer terpisah, jadi posisi HP bisa diatur independen. File-nya dibiarkan
# ada, tapi tidak lagi jadi input.
# ==========================================================================
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$out  = Join-Path $root 'assets\img\hero-bg-tema2.jpg'

# --- Frame ------------------------------------------------------------------
# Figma node 16:4171 = 1440x810. Ditulis @2x supaya teks UI di dalam mockup HP
# tidak blur di layar high-DPI (versi 1x pernah dicoba dan terlihat blur).
# CSS-nya `object-fit: cover`, jadi rasio kanvas harus SAMA dengan rasio box
# `.hero` (1440x810) — kalau tidak, cover akan meng-crop sisi dan tepi kanan
# mockup HP-nya ikut terpotong.
$scale = 2
$FW = 1440.0
$FH = 810.0
$W  = [int]($FW * $scale)   # 2880
$H  = [int]($FH * $scale)   # 1620

# --- Layer -----------------------------------------------------------------
# Semua angka dalam koordinat frame Figma (1x) dan disalin langsung dari
# `get_design_context` node 16:4171. Tiap layer punya:
#   box  = kotak container-nya (yang meng-clip; setara `overflow: hidden`)
#   img  = posisi/ukuran gambar DI DALAM box itu (bisa negatif / lebih besar)
#   grad = gradient overlay di atas box, spek `linear-gradient()` CSS
# `cover` = gambarnya di-`object-fit: cover` ke box, bukan pakai offset img.
$layers = @(
  # node 16:4172 "Asset Hero 2" — bottom:-268 h:1078 left:calc(50%+83.5) w:1595
  #   -> box y = (810+268)-1078 = 0 ; box x = (720+83.5)-1595/2 = 6
  # img: left -1.4% top -0.04% w 101.42% h 100.04% (relatif box)
  @{
    file = 'Asset Hero 2.png'
    box  = @{ x = 6.0; y = 0.0; w = 1595.0; h = 1078.0 }
    img  = @{ x = -0.014 * 1595.0; y = -0.0004 * 1078.0; w = 1.0142 * 1595.0; h = 1.0004 * 1078.0 }
    grad = @{ angle = 264.46928638629254; stop1 = 0.61986; stop2 = 2.8594 }
  },

  # node 16:4174 "image 365", di dalam frame 16:4173 (x 717.3604, y -16, 746.2798x805)
  #   right:0.42 w:745.861   -> box x = 717.3604 + (746.2798 - 0.42 - 745.861) = 717.359
  #   bottom:16.65 h:771.269 -> box y = -16 + (805 - 16.65 - 771.269)          = 1.081
  # img: left -83.74% w 183.74% h 100% (relatif box)
  @{
    file = 'Asset Hero Kolase.png'
    box  = @{ x = 717.359; y = 1.081; w = 745.861; h = 771.269 }
    img  = @{ x = -0.8374 * 745.861; y = 0.0; w = 1.8374 * 745.861; h = 771.269 }
    grad = @{ angle = 80.17751609646538; stop1 = 0.13713; stop2 = 1.9975 }
  },

  # node 16:4175 "Rectangle" (mockup HP) — left:188.97 top:0 w:395.986 h:805.22
  # di dalam frame 16:4173 -> box x = 717.3604 + 188.9719 = 906.332 ; y = -16 + 0 = -16
  # Tanpa gradient overlay (di Figma juga tidak ada) — ini satu-satunya layer
  # yang tampil terang/tajam, jadi tidak boleh diredupkan.
  @{
    file  = 'Asset Hero HP.png'
    box   = @{ x = 906.332; y = -16.0; w = 395.98583984375; h = 805.2202758789062 }
    cover = $true
  }
)

# Warna dasar section — Figma root `bg-[#1c1a16]`, sama dengan --bg di CSS.
$BG = [System.Drawing.Color]::FromArgb(255, 28, 26, 22)

# --- Assertion: puncak HP tidak boleh bisa kepotong navbar -----------------
# Bounding box alpha "Asset Hero HP.png" (3920x3500) terukur y=288..3321,
# x=1260..2682 (langkah sampling 8px, jadi ±8px). HP-nya digambar `cover` ke
# box 395.986x805.220, jadi skalanya dibatasi tinggi: 805.2203/3500.
# Puncak badan HP di koordinat frame = box.y + 288 * skala.
# Di situs ini ada `.topbar` 50px DI ATAS `.hero` (bukan overlay), jadi angka
# ini juga = jarak bersih HP dari navbar. Dulu di frame 740 angkanya cuma 25,5
# sehingga perlu digeser manual; frame 810 memberi ruangnya secara alami.
$phoneAlphaTop    = 288.0
$phoneAlphaBottom = 3321.0
$phoneSrcH        = 3500.0
$phoneBox         = $layers[2].box
$phoneCoverScale  = $phoneBox.h / $phoneSrcH
$phoneTop         = $phoneBox.y + $phoneAlphaTop * $phoneCoverScale
$phoneBottom      = $phoneBox.y + $phoneAlphaBottom * $phoneCoverScale

if ($phoneTop -lt 40.0) {
  throw "puncak HP cuma $([math]::Round($phoneTop,1))px dari tepi atas Hero — terlalu dekat navbar 50px. Naikkan `$FH atau turunkan box HP-nya."
}
if ($phoneBottom -gt $FH) {
  throw "dasar HP $([math]::Round($phoneBottom,1))px > tinggi frame $FH — HP kepotong di bawah."
}
"  HP: puncak y=$([math]::Round($phoneTop,1)) dasar y=$([math]::Round($phoneBottom,1)) (frame $FH, skala cover $([math]::Round($phoneCoverScale,6)))"

# --- Helper: gradient overlay ala CSS `linear-gradient()` -------------------
# CSS: sudut 0deg = ke atas, bertambah searah jarum jam. Garis gradient lewat
# titik pusat box; panjangnya L = |W*sin A| + |H*cos A| (rumus CSS spec).
# Titik t=0 dan t=1 = pusat ∓ (L/2)*arah. Posisi stop CSS (yang di sini bisa
# >100%, mis. 285.94%) dipetakan ke ruang t yang sama, lalu alpha di t=0 dan
# t=1 dihitung manual dan diberikan ke LinearGradientBrush sebagai 3 stop:
# [0, stop1, 1]. Karena alpha-nya linear terhadap t, 3 stop sudah eksak —
# tidak ada aproksimasi.
function New-CssLinearGradientBrush {
  param([double]$w, [double]$h, [double]$angleDeg, [double]$s1, [double]$s2, [System.Drawing.Color]$color)

  $rad  = $angleDeg * [math]::PI / 180.0
  $sinA = [math]::Sin($rad)
  $cosA = [math]::Cos($rad)
  # Arah "maju" gradient dalam koordinat layar (y ke bawah).
  $dx = $sinA
  $dy = -$cosA
  $L  = [math]::Abs($w * $sinA) + [math]::Abs($h * $cosA)

  $cx = $w / 2.0
  $cy = $h / 2.0
  $p0 = New-Object System.Drawing.PointF(($cx - $dx * $L / 2.0), ($cy - $dy * $L / 2.0))
  $p1 = New-Object System.Drawing.PointF(($cx + $dx * $L / 2.0), ($cy + $dy * $L / 2.0))

  function Get-AlphaAt([double]$t) {
    if ($t -le $s1) { return 255 }
    if ($t -ge $s2) { return 0 }
    return [int][math]::Round(255.0 * (1.0 - ($t - $s1) / ($s2 - $s1)))
  }
  $a0 = Get-AlphaAt 0.0
  $aS = Get-AlphaAt $s1
  $a1 = Get-AlphaAt 1.0

  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($p0, $p1, $color, $color)
  # TileFlipXY: di luar rentang p0..p1 brush memantul, bukan mengulang tajam —
  # menghindari garis keras di tepi kalau ada pembulatan sub-pixel.
  $brush.WrapMode = [System.Drawing.Drawing2D.WrapMode]::TileFlipXY

  $blend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
  $blend.Positions = @(0.0, [float]$s1, 1.0)
  $blend.Colors = @(
    [System.Drawing.Color]::FromArgb($a0, $color),
    [System.Drawing.Color]::FromArgb($aS, $color),
    [System.Drawing.Color]::FromArgb($a1, $color)
  )
  $brush.InterpolationColors = $blend

  return @{ brush = $brush; a0 = $a0; a1 = $a1 }
}

# --- Susun kanvas ----------------------------------------------------------
$canvas = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$bgBrush = New-Object System.Drawing.SolidBrush($BG)
$g.FillRectangle($bgBrush, 0, 0, $W, $H)

foreach ($layer in $layers) {
  $path = Join-Path $root $layer.file
  if (-not (Test-Path $path)) {
    throw "Aset sumber tidak ada: $path`nUnduh ulang dari Figma node 16:4171 (lihat komentar header)."
  }

  $src = [System.Drawing.Bitmap]::FromFile($path)

  # Box container di piksel kanvas (@2x).
  $bx = $layer.box.x * $scale
  $by = $layer.box.y * $scale
  $bw = [int][math]::Round($layer.box.w * $scale)
  $bh = [int][math]::Round($layer.box.h * $scale)

  # Render layer ke bitmap seukuran box -> otomatis meng-clip seperti
  # `overflow: hidden`, sehingga gradient overlay-nya juga pas sebatas box
  # (bukan seluruh kanvas) — ini penting, karena panjang garis gradient CSS
  # dihitung dari ukuran box-nya, bukan dari viewport.
  $tile = New-Object System.Drawing.Bitmap($bw, $bh)
  $tg = [System.Drawing.Graphics]::FromImage($tile)
  $tg.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $tg.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $tg.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  if ($layer.ContainsKey('cover') -and $layer.cover) {
    # object-fit: cover — skala = max(bw/srcW, bh/srcH), lalu di-center.
    $cs = [math]::Max($bw / [double]$src.Width, $bh / [double]$src.Height)
    $dw = $src.Width * $cs
    $dh = $src.Height * $cs
    $ox = ($bw - $dw) / 2.0
    $oy = ($bh - $dh) / 2.0
    $tg.DrawImage($src, [float]$ox, [float]$oy, [float]$dw, [float]$dh)
    "  {0,-24} cover box {1}x{2} @ ({3},{4})  skala {5}" -f `
      $layer.file, $bw, $bh, [math]::Round($bx), [math]::Round($by), [math]::Round($cs, 5)
  } else {
    $ix = $layer.img.x * $scale
    $iy = $layer.img.y * $scale
    $iw = $layer.img.w * $scale
    $ih = $layer.img.h * $scale
    $tg.DrawImage($src, [float]$ix, [float]$iy, [float]$iw, [float]$ih)
    "  {0,-24} box {1}x{2} @ ({3},{4})  img {5}x{6} @ ({7},{8})" -f `
      $layer.file, $bw, $bh, [math]::Round($bx), [math]::Round($by), `
      [math]::Round($iw), [math]::Round($ih), [math]::Round($ix), [math]::Round($iy)
  }

  if ($layer.ContainsKey('grad')) {
    $gr = New-CssLinearGradientBrush -w $bw -h $bh `
            -angleDeg $layer.grad.angle -s1 $layer.grad.stop1 -s2 $layer.grad.stop2 -color $BG
    $tg.FillRectangle($gr.brush, 0, 0, $bw, $bh)
    $gr.brush.Dispose()
    "  {0,-24} gradient {1}deg  alpha t=0 -> {2}, t=1 -> {3}" -f `
      '', $layer.grad.angle, $gr.a0, $gr.a1
  }

  $tg.Dispose()
  $g.DrawImage($tile, [float]$bx, [float]$by, [float]$bw, [float]$bh)
  $tile.Dispose()
  $src.Dispose()
}

$g.Dispose()

# JPEG kualitas 82 — konsisten dengan aset foto opaque lain di proyek ini.
$codec  = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82)

# Simpan lewat file sementara: kalau $out sedang dibuka proses lain (mis. server
# preview), Save() langsung ke path itu bisa gagal.
$tmp = Join-Path $root 'assets\img\hero-bg-tema2.tmp.jpg'
$canvas.Save($tmp, $codec, $params)
$canvas.Dispose(); $bgBrush.Dispose()
Move-Item -Path $tmp -Destination $out -Force

"OK {0}x{1} -> {2} ({3} KB)" -f $W, $H, $out, [math]::Round((Get-Item $out).Length / 1KB)
