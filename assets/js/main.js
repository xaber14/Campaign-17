/* ==========================================================================
   Kuis Spesial Kemerdekaan 2026 — Dengar Stori | Kompas.com
   Landing page behaviour.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     KONFIGURASI KAMPANYE
     Ubah nilai di blok ini saja — tidak perlu menyentuh bagian lain.
     ------------------------------------------------------------------------ */
  var CAMPAIGN = {
    // Periode kuis (WIB / UTC+7).
    startAt: '2026-08-12T00:00:00+07:00',
    endAt:   '2026-08-17T23:59:59+07:00',

    // Kapan section "Pengumuman Pemenang" mulai tampil.
    winnersAnnouncedAt: '2026-08-17T12:00:00+07:00',

    // Tujuan CTA.
    links: {
      instagram: 'https://www.instagram.com/kompascom/',
      mediopods: 'https://mediopods.kompas.com/'
    }
  };

  /* ------------------------------------------------------------------------
     Util
     ------------------------------------------------------------------------ */
  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  // Query string, dipakai untuk preview: ?preview=winners | ?preview=running
  var params = new URLSearchParams(window.location.search);
  var previewMode = params.get('preview');

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Fade-through kecil dipakai untuk pergantian konten (bukan section reveal):
  // showEl muncul, hideEls hilang, tanpa keduanya kelihatan bertumpuk sekaligus.
  // Kalau reduced-motion aktif, langsung tukar tanpa delay/animasi.
  function crossfade(showEl, hideEls) {
    if (!showEl) return;
    if (reduceMotion) {
      hideEls.forEach(function (el) { el.hidden = true; });
      showEl.hidden = false;
      return;
    }

    var OUT_MS = 160;
    var anyLeaving = false;
    hideEls.forEach(function (el) {
      if (el.hidden) return;
      anyLeaving = true;
      el.classList.add('is-swapping');
    });

    window.setTimeout(function () {
      hideEls.forEach(function (el) { el.hidden = true; el.classList.remove('is-swapping'); });
      showEl.hidden = false;
      showEl.classList.add('is-swapping');
      void showEl.offsetWidth; // paksa reflow supaya penghapusan class di bawah benar-benar dianimasikan
      showEl.classList.remove('is-swapping');
    }, anyLeaving ? OUT_MS : 0);
  }

  /* ------------------------------------------------------------------------
     1. CTA — arahkan tombol ke tujuan dari CAMPAIGN.links
     ------------------------------------------------------------------------ */
  $$('[data-link]').forEach(function (el) {
    var href = CAMPAIGN.links[el.getAttribute('data-link')];
    if (href) el.setAttribute('href', href);
  });

  /* ------------------------------------------------------------------------
     2. Gambar opsional — tampilkan fallback sampai file asli tersedia
     ------------------------------------------------------------------------ */
  $$('[data-optional-img]').forEach(function (wrap) {
    var img = $('.opt-img', wrap);
    if (!img) return;

    function markLoaded() { wrap.classList.add('is-loaded'); }

    // Gambar bisa saja sudah selesai dimuat sebelum script ini jalan.
    if (img.complete && img.naturalWidth > 0) markLoaded();
    else img.addEventListener('load', markLoaded, { once: true });
    // Kalau gagal: biarkan fallback tetap tampil (tanpa ikon broken image).
  });

  /* ------------------------------------------------------------------------
     3b. Langkah "Cara Main" — klik nomor untuk mengganti visual di kanan
     ------------------------------------------------------------------------ */
  function selectStep(stepNumber, skipAnim) {
    // Sorot langkah terpilih di SEMUA panel, supaya saat tab berganti
    // langkah aktifnya tetap sinkron.
    $$('.step').forEach(function (step) {
      var on = step.getAttribute('data-step') === String(stepNumber);
      step.classList.toggle('is-active', on);
      if (on) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });

    // Dibatasi ke showcase yang sedang tidak hidden (tab aktif) saja — Instastory
    // dan Mediopods masing-masing punya showcase & aset gambar sendiri sekarang.
    var showItem = null;
    var hideItems = [];
    $$('.showcase:not([hidden]) [data-showcase-step]').forEach(function (item) {
      if (item.getAttribute('data-showcase-step') === String(stepNumber)) showItem = item;
      else hideItems.push(item);
    });

    if (skipAnim) {
      hideItems.forEach(function (item) { item.hidden = true; });
      if (showItem) showItem.hidden = false;
    } else {
      crossfade(showItem, hideItems);
    }

    // Titik indikator di bawah showcase desktop — per-showcase supaya index-nya
    // tidak ikut geser kalau (secara teori) lebih dari satu showcase tidak hidden.
    $$('.showcase:not([hidden])').forEach(function (showcase) {
      $$('.showcase__dot', showcase).forEach(function (dot, i) {
        dot.classList.toggle('is-active', String(i + 1) === String(stepNumber));
      });
    });
  }

  (function initSteps() {
    var steps = $$('.step');
    if (!steps.length) return;

    steps.forEach(function (step) {
      step.addEventListener('click', function () {
        selectStep(step.getAttribute('data-step'));
        // Klik manual me-restart hitungan 5 detik showcase yang lagi aktif,
        // biar tidak langsung "kesambar" auto-advance sesaat setelah diklik.
        var activeShowcase = $('.showcase:not([hidden])');
        if (activeShowcase && showcaseAutoplay[activeShowcase.id]) {
          showcaseAutoplay[activeShowcase.id].start();
        }
      });
    });

    selectStep('1', true);
  })();

  /* ------------------------------------------------------------------------
     3c. Showcase desktop: auto-advance + chevron manual (lihat styles.css §9).
        Tiap 5 detik pindah ke langkah berikutnya (loop 1→4→1). Berhenti
        selagi kursor ada di atas showcase (hover), lanjut lagi begitu kursor
        keluar. Chevron kiri/kanan mengganti langkah manual lewat selectStep()
        yang sama dipakai tombol langkah di kiri — jadi titik indikator, daftar
        langkah, dan showcase selalu sinkron dari satu sumber kebenaran.
        reduced-motion: auto-advance mati total, chevron tetap bisa dipakai.
     ------------------------------------------------------------------------ */
  var showcaseAutoplay = {}; // id showcase -> { start, stop }

  $$('.showcase').forEach(function (showcase) {
    var totalSteps = $$('[data-showcase-step]', showcase).length;
    if (!totalSteps) return;

    function currentStepNumber() {
      var shown = $('[data-showcase-step]:not([hidden])', showcase);
      return shown ? Number(shown.getAttribute('data-showcase-step')) : 1;
    }

    function goToStep(n) {
      var wrapped = ((n - 1) + totalSteps) % totalSteps + 1;
      selectStep(wrapped);
    }

    var prevBtn = $('.showcase__nav--prev', showcase);
    var nextBtn = $('.showcase__nav--next', showcase);
    if (prevBtn) prevBtn.addEventListener('click', function () { goToStep(currentStepNumber() - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToStep(currentStepNumber() + 1); start(); });

    var timer = null;
    function start() {
      stop();
      if (reduceMotion) return; // tidak auto-advance sama sekali untuk reduced-motion
      timer = window.setInterval(function () { goToStep(currentStepNumber() + 1); }, 5000);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    showcase.addEventListener('mouseenter', stop);
    showcase.addEventListener('mouseleave', function () { if (!showcase.hidden) start(); });

    showcaseAutoplay[showcase.id] = { start: start, stop: stop };

    // Auto-advance-nya BELUM dinyalakan di sini — baru mulai setelah user
    // benar-benar scroll ke section ini (lihat §3e initPlaySectionAutoplayGate
    // di bawah), supaya slide tidak "kabur" duluan sebelum kelihatan.
  });

  /* ------------------------------------------------------------------------
     3d. Carousel Cara Main — versi mobile dari .steps (lihat styles.css §9b).
        Satu carousel per tab, cuma tampil ≤640px (CSS yang mengurus switch-nya
        lewat display:none — JS di sini tidak perlu tahu breakpoint aktif atau
        tidak, cukup jalan terus; kalau lagi disembunyikan CSS, auto-geser
        toh tidak kelihatan efeknya sampai carousel itu ditampilkan lagi).

        - Geser otomatis tiap 5 detik, berhenti selagi user menyentuh track.
        - Bisa juga digeser manual — pakai native scroll-snap, bukan kode drag
          sendiri, supaya terasa seperti scroll asli (momentum, dsb).
        - reduced-motion: auto-geser dimatikan total, geser manual jadi instan
          (tanpa animasi smooth-scroll).
     ------------------------------------------------------------------------ */
  var carousels = {}; // id elemen root -> { start, stop, reset }

  $$('[data-carousel]').forEach(function (root) {
    var track = $('[data-carousel-track]', root);
    var slides = $$('[data-carousel-slide]', track);
    var dotsWrap = $('[data-carousel-dots]', root);
    if (!track || !slides.length) return;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'steps-carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Ke langkah ' + (i + 1));
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () {
        goTo(i, true);
        start(); // restart hitungan 5 detik dari awal, sama seperti setelah swipe manual
      });
      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });

    var current = 0;
    var timer = null;

    function setActiveDot(index) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function goTo(index, smooth) {
      current = (index + slides.length) % slides.length;
      track.scrollTo({
        left: track.clientWidth * current,
        behavior: (reduceMotion || !smooth) ? 'auto' : 'smooth'
      });
      setActiveDot(current);
    }

    function next() { goTo(current + 1, true); }

    function start() {
      stop();
      if (reduceMotion) return; // tidak auto-geser sama sekali untuk reduced-motion
      timer = window.setInterval(next, 5000);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function reset() { goTo(0, false); }

    // Sinkronkan titik aktif kalau user swipe manual (bukan lewat goTo()).
    var scrollTimer = null;
    track.addEventListener('scroll', function () {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        var index = Math.round(track.scrollLeft / track.clientWidth);
        current = Math.max(0, Math.min(slides.length - 1, index));
        setActiveDot(current);
      }, 100);
    }, { passive: true });

    // Berhenti auto-geser selagi disentuh/drag, lanjut lagi setelah dilepas.
    track.addEventListener('pointerdown', stop);
    track.addEventListener('pointerup', start);
    track.addEventListener('pointercancel', start);

    carousels[root.id] = { start: start, stop: stop, reset: reset };

    // Auto-geser-nya BELUM dinyalakan di sini — sama seperti showcase desktop,
    // baru mulai setelah section ini kelihatan di viewport (lihat §3e di bawah).
  });

  /* ------------------------------------------------------------------------
     3e. Gerbang auto-slide "Cara Main" — baik showcase desktop maupun
        carousel mobile BARU mulai auto-advance setelah user benar-benar
        scroll sampai section ini terlihat, bukan langsung jalan sejak
        halaman dimuat (biar tidak ada slide yang "kelewat" sebelum user
        sempat melihatnya). Sekali section ini pernah kelihatan, observer-nya
        berhenti mengamati — perilaku start/stop selanjutnya (hover, ganti
        tab, klik langkah) tetap berjalan seperti biasa lewat registry di atas.
     ------------------------------------------------------------------------ */
  (function initPlaySectionAutoplayGate() {
    var section = $('.play');
    if (!section || reduceMotion) return; // reduced-motion: start() sendiri sudah no-op

    function startWhicheverIsActive() {
      var activeShowcase = $('.showcase:not([hidden])');
      if (activeShowcase && showcaseAutoplay[activeShowcase.id]) showcaseAutoplay[activeShowcase.id].start();

      var activeCarouselRoot = $('[data-carousel]:not([hidden])');
      if (activeCarouselRoot && carousels[activeCarouselRoot.id]) carousels[activeCarouselRoot.id].start();
    }

    if (!('IntersectionObserver' in window)) {
      startWhicheverIsActive();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        startWhicheverIsActive();
        io.disconnect();
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    io.observe(section);
  })();

  /* ------------------------------------------------------------------------
     3. Tab "Cara Main" — Instastory / Mediopods
     ------------------------------------------------------------------------ */
  (function initTabs() {
    var tabs = $$('.switch__btn');
    if (!tabs.length) return;

    function activate(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var selected = i === index;
        var panel = document.getElementById(tab.getAttribute('aria-controls'));
        // Carousel mobile & showcase desktop punya id kembar dengan panel-nya,
        // cuma beda prefix.
        var carouselId = tab.getAttribute('aria-controls').replace('panel-', 'carousel-');
        var showcaseId = tab.getAttribute('aria-controls').replace('panel-', 'showcase-');
        var carouselEl = document.getElementById(carouselId);
        var showcaseEl = document.getElementById(showcaseId);
        var carousel = carousels[carouselId];
        var showcaseAuto = showcaseAutoplay[showcaseId];

        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (panel) panel.hidden = !selected;
        if (carouselEl) carouselEl.hidden = !selected;
        if (showcaseEl) showcaseEl.hidden = !selected;

        if (carousel) {
          if (selected) { carousel.reset(); carousel.start(); }
          else carousel.stop();
        }
        if (showcaseAuto) {
          if (selected) showcaseAuto.start();
          else showcaseAuto.stop();
        }
      });
      // Mulai lagi dari langkah 1 setiap kali cara mainnya berganti.
      selectStep('1');
      if (moveFocus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(i, false); });

      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;

        if (next !== null) {
          event.preventDefault();
          activate(next, true);
        }
      });
    });
  })();

  /* ------------------------------------------------------------------------
     4. Gating section Pengumuman Pemenang
        Tampil hanya setelah CAMPAIGN.winnersAnnouncedAt.
        Preview manual: ?preview=winners (paksa tampil)
                        ?preview=running (paksa sembunyi)

     ⚠️ SEMENTARA DINONAKTIFKAN untuk keperluan review desain & konten.
     Section akan SELALU tampil terlepas dari tanggal, sampai flag di bawah
     ini dikembalikan ke `false`. JANGAN lupa set balik sebelum go-live —
     tanpa ini, pemenang akan terlihat publik sebelum periode kuis berakhir.
     ------------------------------------------------------------------------ */
  var DEV_ALWAYS_SHOW_WINNERS = true;

  (function initWinnersGate() {
    var section = $('[data-winners]');
    if (!section) return;

    var announceAt = new Date(CAMPAIGN.winnersAnnouncedAt).getTime();
    var shouldShow;

    if (DEV_ALWAYS_SHOW_WINNERS) shouldShow = true;
    else if (previewMode === 'winners') shouldShow = true;
    else if (previewMode === 'running') shouldShow = false;
    else shouldShow = isFinite(announceAt) && Date.now() >= announceAt;

    section.hidden = !shouldShow;
  })();

  /* ------------------------------------------------------------------------
     5. Scroll reveal — elemen ber-atribut [data-reveal] muncul saat masuk viewport.
        Dilewati total kalau reduced-motion aktif — CSS-nya sendiri (lihat
        styles.css §14) membuat semua elemen tampil penuh di luar
        `prefers-reduced-motion: no-preference`, jadi tanpa blok ini pun
        halaman tetap benar, cuma tanpa animasi.
     ------------------------------------------------------------------------ */
  (function initScrollReveal() {
    if (reduceMotion) return;

    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------------------------------
     6. Newsletter footer — placeholder submit
        Ganti dengan endpoint langganan yang sebenarnya.
     ------------------------------------------------------------------------ */
  (function initNewsletter() {
    var form = $('.fnews');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = $('.fnews__input', form);
      var value = input ? input.value.trim() : '';

      if (!value || value.indexOf('@') === -1) {
        if (input) input.focus();
        return;
      }
      // TODO: hubungkan ke endpoint langganan Kompas.com.
      var btn = $('.fnews__btn', form);
      if (btn) btn.textContent = 'Terkirim';
    });
  })();

})();
