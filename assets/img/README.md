# Slot gambar

Dua aset raster dari Figma (`hero-bg.jpg`, `logo-dengar-stori.png`) sudah terpasang.
Sisanya masih pakai fallback yang rapi, jadi tetap tampil utuh tanpa file-file itu.
Begitu file aslinya ditaruh di folder ini dengan nama di bawah, gambar akan otomatis
dipakai dan fallback-nya hilang — tanpa perlu mengubah kode.

| Nama file                | Ukuran          | Dipakai di                        | Node Figma  | Status |
| ------------------------ | --------------- | --------------------------------- | ----------- | ------ |
| `hero-bg.jpg`            | 1440 × 740      | Latar foto Hero — **Tema 1**      | `343:1313`  | ✅ terpasang |
| `hero-bg-tema2.jpg`      | 2880 × 1480 (2×) | Latar foto Hero — **Tema 2** (foto + kolase + mockup HP, komposit) | `44:6649` (file `Wpib0…`) | ✅ terpasang |
| `section2-bg.jpg`        | 1440 × 907      | Latar bawah Section 2             | `343:4435`  | ✅ terpasang |
| `winners-map.png`        | 1440 × 431      | Latar peta titik-titik Pengumuman Pemenang | `335:2291` | ✅ terpasang |
| `logo-dengar-stori.png`  | 166 × 148       | Logo "Dengar Stori" di Hero       | `335:69`    | ✅ terpasang |
| `hadiah-podium.png`      | 333 × 222       | Foto podium hadiah (transparan) di kartu "Menangkan Hadiah" — **Tema 1** | `362:1834` | ✅ terpasang |
| `hadiah-gopay.png`       | 1071 × 543 (3×) | Tumpukan kartu notifikasi GoPay di kartu "Menangkan Hadiah" — **Tema 2** | `57:2524` (file `Wpib0…`) | ✅ terpasang |
| `cara-main-1.jpg`        | 1100 × 1100     | Visual langkah 1, tab **Instastory** | —        | ✅ terpasang |
| `cara-main-2.jpg`        | 1100 × 1100     | Visual langkah 2, tab **Instastory** | —        | ✅ terpasang |
| `cara-main-3.jpg`        | 1100 × 1100     | Visual langkah 3, tab **Instastory** | —        | ✅ terpasang |
| `cara-main-mediopods-1.jpg` | 1100 × 1100  | Visual langkah 1, tab **Mediopods**  | —        | ✅ terpasang |
| `cara-main-mediopods-2.jpg` | 1100 × 1100  | Visual langkah 2, tab **Mediopods**  | —        | ✅ terpasang |
| `cara-main-mediopods-3.jpg` | 1100 × 1100  | Visual langkah 3, tab **Mediopods**  | —        | ✅ terpasang |
| `cara-main-4.jpg`        | 1100 × 1100     | Visual langkah 4, **Tema 1** (dipakai bersama Instastory & Mediopods) | — | ✅ terpasang |
| `cara-main-podcast-1.jpg` | 1100 × 1100    | Visual langkah 1, **Tema 2** (podcast-only) | — | ✅ terpasang |
| `cara-main-podcast-2.jpg` | 1100 × 1100    | Visual langkah 2, **Tema 2** | — | ✅ terpasang |
| `cara-main-podcast-3.jpg` | 1100 × 1100    | Visual langkah 3, **Tema 2** | — | ✅ terpasang |
| `footer-logo.png`        | 275 × 55        | Logo Kompas.com di footer          | `1:405` (file `Wpib0…`) | ✅ terpasang |
| `footer-store-appstore.png` | 196 × 66     | Badge "Download di App Store"     | `1:436`     | ✅ terpasang |
| `footer-store-googleplay.png` | 222 × 66   | Badge "Temukan di Google Play"    | `1:437`     | ✅ terpasang |
| `footer-award-wowbrand.png` | 70 × 55      | Badge "Progress WOW Brand 2019"   | `1:441`     | ✅ terpasang |
| `footer-award-superbrands.png` | 63 × 60   | Badge "Superbrands Indonesia's Choice" | `1:442` | ✅ terpasang |
| `footer-award-factchecking.png` | 65 × 65  | Badge "Internews Fact-checking Signatory" | `1:443` | ✅ terpasang |
| `footer-icon-facebook.svg` | 16 × 16       | Ikon sosial Facebook (inline jadi `#i-facebook`) | `1:411` | ✅ dipakai |
| `footer-icon-x.svg`      | 16 × 16.31      | Ikon sosial X (inline jadi `#i-x`)  | `1:415`     | ✅ dipakai |
| `footer-icon-instagram.svg` | 20 × 20      | Referensi ikon Instagram footer (tidak dipakai langsung — dipetakan ke `#i-instagram` yang sudah ada) | `1:419` | referensi |
| `footer-icon-linkedin.svg` | 16.79 × 16    | Ikon sosial **LINE** (nama file keliru saat diunduh — isinya logo blob LINE, bukan LinkedIn; inline jadi `#i-line`) | `1:426` | ✅ dipakai |
| `footer-icon-tiktok.svg` | 32 × 32         | Referensi ikon TikTok (inline jadi `#i-tiktok`, self-contained — lingkaran + logo satu unit) | `1:432` | referensi |
| `footer-icon-mail.svg`   | 24 × 24         | Referensi ikon amplop tombol newsletter (inline jadi `#i-mail`) | `1:448` | referensi |
| `footer-line.svg`        | 1440 × 4        | Garis pembatas atas footer — **tidak dipakai sebagai file**, diganti `border-top` CSS (`#515151`, 4px) karena hasilnya identik dan lebih ringan | `1:475` | tidak dipakai |

## Catatan per slot

**`hero-bg.jpg`** — markup-nya di `index.html` (`.hero__photo` → `<img class="hero__photo-img">`),
style di `assets/css/styles.css`.

> ⚠️ **Penting:** file ini adalah **export komposit final** dari frame Hero di Figma
> (1440×740, persis ukuran frame). Opacity 70% foto, gradient veil gelap, dan glow
> ellipse **semuanya sudah ter-bake ke dalam pixel-nya**. Sudah diverifikasi: baris
> paling bawah gambar terukur `rgb(27,26,22)` — itu warna veil `#1C1A16`.
>
> Jadi gambar ini **harus digambar apa adanya**: opacity 1, tanpa overlay veil, tanpa
> glow. Kalau treatment itu diterapkan lagi di CSS, Hero jadi gelap dua kali dan tidak
> lagi cocok dengan Figma.

Dipakai sebagai elemen `<img>` (bukan CSS `background-image`) supaya bisa memakai
`object-fit: cover` + `object-position: center bottom`. Anchor ke bawah dipilih supaya
fade gelap yang sudah ter-bake selalu menyentuh dasar Hero, sehingga sambungan ke section
di bawahnya tetap mulus di layar yang lebih lebar dari 1440px.

Kalau nanti aset diganti dengan foto mentah (belum ada veil-nya), treatment veil +
opacity perlu dikembalikan ke CSS agar teks tetap terbaca.

Transisi ke Section 2 **bukan** dari gambar ini, tapi dari `.hero__blend` — ellipse
`#1C1A16` ber-blur (Figma "Ellipse 3", node `343:1315`) yang di-CSS murni, tanpa aset.

**`hero-bg-tema2.jpg`** — latar Hero versi **Tema 2** (Figma `16:4171`, file
`BbdQ2sSITixKR7raGXSOw5` "Backup Kuis 17an").

Sama seperti `hero-bg.jpg`, yang dipakai di HTML adalah **satu file komposit
flattened** — foto massa "INDONESIA MERDEKA", kolase Proklamasi/bendera,
gradient veil, dan mockup HP pemutar podcast semuanya ter-bake jadi satu.
Dipasang dengan treatment identik (`object-fit: cover`,
`object-position: center bottom`), jadi perilaku responsifnya persis sama
dengan Tema 1.

Ukurannya **2× (2880×1620)**, bukan 1×. Versi 1× pernah dicoba demi konsistensi
dengan Tema 1, tapi teks UI di dalam mockup HP-nya kelihatan blur di layar
high-DPI. Sekitar **275 KB** — masih lebih kecil dari `hero-bg.jpg` (451 KB @1×)
karena separuh kiri gambarnya nyaris rata gelap.

> **Rasio 2880×1620 (= 1440×810) wajib dijaga.** `.hero` versi Tema 2
> `min-height`-nya 810px (styles.css §16, ikut revisi Figma `16:4171` — sebelumnya
> 740px). Karena aset ini dipasang `object-fit: cover`, rasio yang tidak sama
> dengan box `.hero` akan membuat browser meng-crop sisinya, dan tepi kanan
> mockup HP-lah yang pertama kena. Jadi kalau tinggi Hero diubah, tinggi kanvas
> di `tools/build-hero-tema2.ps1` (`$FH`) harus diubah bersamaan.

### Cara membangun ulang

Ada skrip-nya: **[`tools/build-hero-tema2.ps1`](../../tools/build-hero-tema2.ps1)**

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File "tools/build-hero-tema2.ps1"
```

Aset sumbernya tiga PNG **mentah** (belum ada gradient-nya) di **root folder**,
mengikuti pola aset mentah lain seperti `Instastory_*.png`. Semuanya diunduh
dari Figma asset server saat `get_design_context` node `16:4171` dipanggil:

| File sumber | Node Figma | Isi |
| ----------- | ---------- | --- |
| `Asset Hero 2.png` (1536×1024) | fill `16:4172` | foto massa "INDONESIA MERDEKA" |
| `Asset Hero Kolase.png` (1672×941) | fill `16:4174` ("image 365") | kolase Proklamasi + bendera |
| `Asset Hero HP.png` (3920×3500) | fill `16:4175` ("Rectangle") | mockup HP pemutar podcast — **punya alpha** |

Posisi tiap layer, ukuran gambar di dalamnya, dan spek gradient-nya semua ada
sebagai angka di `$layers` dalam skrip, disalin langsung dari output
`get_design_context`. Jadi revisi desain berikutnya (tinggi frame, posisi layer,
sudut gradient) cukup ubah angka di situ — tidak perlu export ulang per node.

**Gradient-nya dihitung oleh skrip**, meniru `linear-gradient()` CSS: arah
`(sin A, −cos A)`, panjang garis `|W·sin A| + |H·cos A|`, lalu posisi stop CSS
(yang di sini melewati 100% — mis. `285.94%`) dipetakan ke ruang itu. Karena
alpha-nya linear terhadap posisi, cukup 3 stop pada `LinearGradientBrush`
(`[0, stop1, 1]`) dan hasilnya **eksak, bukan aproksimasi**. Dua overlay yang
dipakai:

| Layer | Sudut | Alpha di tepi awal → tepi akhir |
| ----- | ----- | ------------------------------- |
| `Asset Hero 2.png` | 264,469° | 255 → 212 (kiri tetap sangat gelap, foto cuma ~17% tembus) |
| `Asset Hero Kolase.png` | 80,178° | 255 → 137 (kiri tertutup penuh, makin ke kanan makin tembus) |

Mockup HP **tidak** diberi overlay (di Figma juga tidak) — ini satu-satunya
layer yang tampil terang dan tajam.

> **Kenapa pendekatannya berubah.** Versi skrip sebelumnya menempel dua PNG yang
> sudah ter-render gradient-nya dari Figma ke kanvas 1440×740, karena menghitung
> gradient ber-sudut dianggap terlalu rawan. Itu terbukti rapuh di dua hal:
> file sumbernya sempat hilang dari root folder (dan sekali hilang, latar ini
> tidak bisa dibangun ulang sama sekali), dan pendekatan itu terkunci di 740px —
> di kanvas segitu mockup HP tidak punya cukup ruang vertikal, sehingga tombol
> "Ikuti Kuis Dengar Stori" selalu jatuh di zona `.hero__blend`, dan begitu
> asetnya digeser ke atas supaya tombolnya lolos, puncak HP-nya yang kepotong
> navbar. Versi sekarang menyusun dari layer mentah, jadi kedua masalah itu
> hilang sekaligus.

Skrip **tidak lagi menggeser isi ke bawah** (`$shift`, dulu 40px). Geseran itu
dulu perlu karena di frame 740 puncak mockup HP cuma 25,5px dari tepi atas,
sementara di situs ini ada `.topbar` 50px **di atas** `.hero` (bukan overlay),
jadi HP-nya terlihat kepotong. Frame 810 memberi ruang itu secara alami:
puncak HP jatuh **50,3px** dari tepi atas Hero. Ramp `$fade` juga tidak perlu
lagi, karena tidak ada strip kosong yang harus ditambal.

Dua assertion menjaga supaya tidak ada yang meleset diam-diam — **gagal keras**
daripada menghasilkan komposit yang salah:

1. puncak badan HP minimal 40px dari tepi atas frame (jadi tidak bisa tersembunyi
   di bawah navbar 50px lagi);
2. dasar badan HP tidak boleh melewati tinggi frame.

Keduanya dihitung dari bounding box alpha `Asset Hero HP.png` (terukur
`y=288..3321`, `x=1260..2682`, sampling 8px) yang dipetakan lewat transform
`object-fit: cover`-nya.

Di HTML-nya `fetchpriority="high"` (bukan `loading="lazy"`) — Tema 2 sekarang
**permanen aktif** (opsi Tema 1/Tema 2 sudah dihilangkan dari navbar), jadi aset
ini yang muncul above-the-fold sejak page load dan wajar dimuat dengan prioritas
tinggi. Aset Tema 1 (`hero-bg.jpg`) yang sebaliknya sekarang `loading="lazy"`,
karena markup/CSS-nya sengaja dipertahankan dormant (tidak dihapus) tapi tidak
pernah dirender.

**Terverifikasi di browser (1440×900, 4 Agustus 2026)** — bukan lewat screenshot,
karena pane browser di lingkungan ini tidak bisa compositing untuk capture layar,
jadi semuanya diukur lewat `getBoundingClientRect` + pemetaan `object-fit: cover`
yang dihitung ulang di halaman:

| Yang diukur | Hasil |
| ----------- | ----- |
| Tinggi `.hero` | 810px |
| Skala cover | tepat 0,5 (pemetaan 1:1 dari kanvas @2×) |
| Puncak HP dari dasar navbar | **+50,3px** (sebelumnya sempat cuma +9,5px) |
| Tepi kanan HP dari tepi kanan foto | +130px (tidak kena crop) |
| Dasar tombol ke kurva ellipse blend | **+8,1px** (tidak tertutup) |
| Overflow horizontal | tidak ada |
| Error console | tidak ada |
| Mobile 375px | `min-height` jadi 0, tinggi menyusut ke konten (665px), tidak ada overflow |

Angka "dasar tombol ke kurva ellipse" dihitung terhadap **kurva** ellipse-nya,
bukan tepi kotaknya: bentuknya benar-benar elips, jadi kedalaman zona gelapnya
beda-beda per x — paling dalam di tengah viewport, paling dangkal di pinggir.
Di rentang x mockup HP kurvanya mulai di y≈699–742 (koordinat frame), sementara
dasar tombol berhenti di y≈691.

`Asset Hero Section Kanan.png` (export flattened kolase+HP yang dipakai versi
skrip lama) **sudah tidak jadi input lagi** — HP dan kolase sekarang dua layer
terpisah sehingga posisinya bisa diatur independen. File-nya dibiarkan ada di
root folder, tidak dihapus.

**`hadiah-gopay.png`** — tumpukan kartu notifikasi GoPay di kartu "Menangkan
Hadiah" versi **Tema 2** (Figma `57:2524`).

Di Figma visual ini disusun dari elemen (3 rect putih berlapis + ikon + teks),
tapi di sini dipakai sebagai **satu PNG transparan** — supaya bayangan berlapis
dan ikon GoPay-nya persis seperti Figma tanpa menyusun ulang selusin elemen.

Sumbernya `Asset Gopay.png` di root folder (1071×501, hasil export dari Figma).
Skalanya **tepat 3×** ukuran Figma — terukur: kartu solidnya (alpha ≥ 240)
menempati 951×399 px, dan 951/317 = 399/133 = 3,000 pas.

Satu transformasi diterapkan saat menyalinnya ke sini: **42px transparan
ditambahkan di ATAS**. Alasannya, padding transparan aset aslinya asimetris
secara vertikal (30px atas vs 72px bawah, karena bayangan jatuh ke bawah), jadi
kalau langsung di-`align-items: center` kartunya meleset ~7px ke atas. Setelah
dipadding jadi 1071×543 dengan padding 60/60 kiri-kanan dan 72/72 atas-bawah,
kartunya center sempurna di kanvas — CSS-nya cukup `align-items: center` tanpa
offset ajaib. Kalau asetnya diexport ulang, ukur lagi bbox alpha-nya dan
samakan padding atas/bawahnya.

Dirender 1/3 → 357×181 CSS px, sehingga kartunya jatuh tepat 317×133 seperti
Figma (terverifikasi di browser: x=50, w=317, h=133, Δ0 px).

**`section2-bg.jpg`** — latar bawah Section 2 (node `343:4435`).

Di Figma node-nya berukuran 1440×1440 di `y=318`, tapi Section 2 (tinggi 1225)
memotongnya, jadi yang benar-benar terlihat hanya **1440×907** — dan itu persis
ukuran aset yang diexport (`1225 − 318 = 907`). Karena itu gambar ini dipasang
**menempel ke dasar Section 2** dengan tinggi tetap 907px (`.slab__bg`).

Sama seperti aset Hero, fade ke warna section **sudah ter-bake**: baris paling atas
gambar terukur `rgb(27,26,22)` = `#1C1A16`. Jadi tidak perlu veil tambahan, dan
sisa area Section 2 di atasnya cukup solid `#1C1A16` — sambungannya tak terlihat.

### Visual "Cara Main" (`cara-main-*.jpg`)

Panel kanan pada section Cara Main **berganti mengikuti langkah yang diklik user**
(lihat `selectStep()` di `assets/js/main.js`). Sumbernya file `Instastory_1.png` ..
`Instastory_4.png` di root folder — mockup foto HP berlatar gelap, masing-masing
1254×1254 (2–2,1 MB). Di-resize ke 1100px + dikompres JPEG kualitas 82 (turun ke
~105–170 KB per file) karena sumbernya opaque (tanpa transparansi).

> ⚠️ **Perubahan struktural (riwayat):** sebelumnya langkah 4 memakai mockup HTML/CSS
> interaktif (frame browser palsu + kartu kuis yang bisa diklik, menunjukkan state
> "sebelum menjawab" → "sudah selesai"). Markup itu (`.preview`, `.quiz`, dst.) sudah
> dihapus total dari `index.html`, `styles.css`, dan `main.js` — digantikan gambar
> statis langkah 4 (`cara-main-4.jpg`, sebuah screenshot asli tampilan kuis di
> artikel). Kalau demo interaktifnya masih diinginkan, tinggal minta.

**Instastory dan Mediopods sekarang punya set visual sendiri-sendiri** untuk langkah
1–3 (awalnya sempat berbagi 1 set gambar, tapi tidak akurat karena flow keduanya
beda — Mediopods lewat homepage→kategori podcast→player, bukan lewat Instastory).
Strukturnya di `index.html`:

- Desktop: dua `<div class="showcase">` terpisah — `#showcase-instastory` dan
  `#showcase-mediopods` — di dalam `.play__body` yang sama. Hanya satu yang
  `hidden=false` di satu waktu, ditentukan oleh tab yang aktif (`initTabs()` di
  `main.js` men-toggle `hidden`-nya, mirip pola `#panel-instastory`/`#panel-mediopods`).
  `selectStep()` sengaja dibatasi query-nya ke `.showcase:not([hidden]) [data-showcase-step]`
  supaya klik langkah di satu tab tidak menyentuh showcase tab lainnya.
- Mobile: `#carousel-instastory` dan `#carousel-mediopods` (lihat bagian carousel di
  bawah) masing-masing punya 4 `<img>` slide sendiri.

**Langkah 4 tetap satu gambar yang sama** (`cara-main-4.jpg`) untuk kedua tab — sudah
tepat begitu, karena "Jawab kuis di artikel" adalah titik temu kedua flow (baik dari
Instastory maupun Mediopods, user berakhir di artikel yang sama), jadi tidak perlu
gambar terpisah.

**`winners-map.png`** — latar peta dunia bertitik di section Pengumuman Pemenang
(Figma "Maps", node `335:2291`).

> Dipakai ulang tanpa export ulang untuk kondisi "Ongoing"/"Winner" (Figma file
> "Backup Kuis 17an" `BbdQ2sSITixKR7raGXSOw5`, node "Maps" `23:13635`/`23:12297`) —
> proporsi & warna dasarnya sama persis, dan node itu juga terlalu besar untuk
> di-fetch penuh (ratusan vector, sparse-metadata response dari Figma), jadi
> lebih murah memakai aset yang sudah ada daripada export ulang.

Di Figma, layer ini sebenarnya terdiri dari **ratusan vector kecil** (tiap titik peta
adalah shape terpisah) — tidak ada satu aset gambar yang bisa langsung dipakai. Karena
itu diexport sebagai **satu file PNG flattened** lewat `download_assets` (bukan hasil
rekonstruksi manual titik demi titik).

File-nya **opaque** (bukan transparan): base fill `#262523` dengan titik-titik sedikit
lebih terang `#2E2C2A` sudah ter-bake jadi satu. `#262523` ini juga dipakai sebagai
`background-color` section (`--winners-bg`), jadi kalau gambar gagal dimuat pun,
warnanya tetap menyatu — tidak ada kotak putih pecah.

Posisinya: di Figma layer ini di-clip oleh section (tinggi section 534, layer mulai di
`y=103`), sehingga bagian yang benar-benar terlihat cuma **1440×431** — dan itu persis
ukuran hasil export (`103 + 431 = 534`, pas di tepi bawah section). Karena itu dipasang
menempel ke dasar section (`bottom: 0`, tinggi tetap 431px), sama seperti pola di
`hero-bg.jpg` dan `section2-bg.jpg`.

> Catatan: section ini awalnya sempat salah dibangun dengan tema terang (platinum/putih)
> di iterasi sebelumnya sebelum node Figma-nya benar-benar dicek. Setelah dicek ulang,
> section ini **gelap** (`#262523`, kartu `#3A3836`) — sudah dikoreksi.

**`logo-dengar-stori.png`** — PNG transparan, sudah pas di frame 166×148.

**`hadiah-podium.png`** — foto podium (piala + kotak hadiah + bendera Merah Putih),
menggantikan ilustrasi SVG buatan sendiri di iterasi sebelumnya sekarang bahwa Figma
sudah menyediakan aset sungguhan (`362:1834`) untuk slot ini.

**PNG dengan alpha transparan** — dicek langsung lewat pixel (sudut kanvas `A=0`,
area kotak hadiah `A=255`), bukan foto dengan background solid. Sumbernya
`Asset Banner Hadiah.png` di root folder (bukan hasil `download_assets` Figma yang
pertama kali dipakai — versi itu ternyata punya background emas solid dan sudah
diganti). Di-resize dari 1536×1024 ke 750×500 (~2,25× ukuran render 333×222, cukup
untuk retina) sambil mempertahankan channel alpha; PNG hasil resize tidak dikompres
seagresif JPEG (format lossless demi transparansi) jadi ukurannya ~490 KB — lebih
besar dari versi JPEG lama, tapi itu konsekuensi yang perlu diterima demi transparansi.

Karena kini transparan, `.prize__media` **tidak lagi punya background sendiri** —
kotak hadiah dimaksudkan mengambang langsung di atas gradient card (dan di depan
`.prize__glow`), bukan duduk di dalam kotak abu-abu. Kalau nanti aset diganti lagi
dengan foto ber-background solid, kembalikan `background: var(--surface-1)` di
`.prize__media` (styles.css) supaya area sebelum gambar termuat tetap terlihat rapi.

Card sekarang juga punya `.prize__glow` — ellipse gelap `#312B21` (345×465) yang
sengaja bocor melewati tepi kiri card lalu ter-clip oleh `overflow:hidden` pada
`.prize`. **Catatan jujur:** export SVG Figma untuk shape ini tidak membawa filter
blur sama sekali (sudah dicek langsung ke file SVG mentahnya), padahal screenshot
Figma menunjukkan tepi yang jelas lembut/blur. Kemungkinan besar itu efek "layer
blur" di Figma yang tidak ikut ter-export. `blur(48px)` di CSS adalah kalibrasi visual
manual terhadap screenshot referensi, **bukan** angka yang terbaca langsung dari Figma
— satu-satunya bagian dari update ini yang tidak 100% presisi by-the-numbers.

### Footer (`footer-*`)

Semua aset footer diunduh dari file Figma terpisah (`Wpib0W14AVOuahrL5rJXNL`, node
`1:4891`) — bukan file utama campaign ini. `download_assets` tidak menjamin urutan
`rawImages` sama dengan urutan konstanta `imgImage`, `imgImage1`... di kode referensi,
jadi setiap file dicek ulang (rasio aspek dibandingkan ke ukuran presisi yang tertulis
di kode Figma) sebelum diberi nama final — beberapa sempat salah nama di percobaan
pertama (badge App Store/Google Play dan 3 badge penghargaan sempat tertukar posisi).

**`footer-icon-linkedin.svg` sebenarnya adalah logo LINE**, bukan LinkedIn — nama filenya
dipertahankan apa adanya (tidak di-rename ulang) supaya jejak unduhan tetap jelas, tapi
di kode (`index.html`) sudah dipakai dengan benar sebagai simbol `#i-line` dengan
`aria-label="LINE"`. Ini masuk akal secara konteks: Kompas.com (media Indonesia)
lazimnya mencantumkan kanal LINE, bukan LinkedIn, di deretan sosial medianya.

Ikon TikTok (`footer-icon-tiktok.svg`, dipetakan ke path internal `#i-tiktok`) di kode
Figma-nya diberi nama layer `pinterest` meski frame pembungkusnya bernama `tik_tok` dan
posisinya di urutan ikon sosial (setelah LINE) — kemungkinan sisa salin-tempel dari
komponen lain di file Figma tersebut. Path-nya tetap direplikasi persis seperti yang
diberikan Figma (bukan diganti dengan logo TikTok generik), konsisten dengan prinsip
mengikuti Figma apa adanya di proyek ini; url tautan tetap mengarah ke TikTok karena
itu jelas maksud penempatannya.

### Cara Main Tema 2 (`cara-main-podcast-*`)

Ketiganya sumbernya `Asset Step 1/2/3.jpg` di root folder (masing-masing
2200×2200), resize ke 1100×1100 + JPEG kualitas 82 — konsisten dengan aset
showcase lain di proyek ini.

- **`cara-main-podcast-1.jpg`** — langkah 1 ("Masuk ke Podcast Kompas.com atau
  masuk melalui notifikasi"): halaman Kompas.com dengan menu Podcast (ikon
  headphone) disorot, dan notifikasi "Denger Podcast bisa dapat hadiah!" di
  bagian bawah.
- **`cara-main-podcast-2.jpg`** — langkah 2 ("Dengarkan Podcast Dengar Stori"):
  pemutar podcast dengan episode "Dengar Stori: Rengasdengklok dan Detik-Detik
  Proklamasi".
- **`cara-main-podcast-3.jpg`** — langkah 3 ("Jawab kuis di artikel"): soal
  kuis pilihan ganda di artikel Kompas.com, dengan info "4 Orang pemenang
  setiap harinya akan mendapatkan GoPay Rp50.000" — jadi TIDAK dipakai bersama
  `cara-main-4.jpg` Tema 1 lagi (versi sebelumnya sempat pinjam gambar itu
  sementara sebelum aset ini dikirim).

Ketiganya sudah dicek isinya persis cocok dengan copy langkah masing-masing —
tidak ada yang tertukar urutan.

## Kalau nama file perlu berbeda

- `hero-bg.jpg` → ubah `url('../img/hero-bg.jpg')` di `assets/css/styles.css`
- sisanya → ubah atribut `src` pada `<img class="opt-img">` di `index.html`
