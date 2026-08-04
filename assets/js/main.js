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

    // Dibatasi ke showcase yang BENAR-BENAR terlihat (activeShowcase(), lihat
    // definisinya di §3f) — bukan cuma `:not([hidden])`. Sejak ada 3 showcase
    // (Instastory, Mediopods, Podcast Tema 2), showcase Tema 2 disembunyikan
    // lewat CSS `display:none` berbasis `data-theme` (bukan atribut `hidden`,
    // yang cuma dipakai untuk switching TAB di dalam Tema 1) — jadi dua showcase
    // sekaligus bisa lolos `:not([hidden])` walau cuma satu yang kelihatan.
    var activeSc = activeShowcase();
    var showItem = null;
    var hideItems = [];
    if (activeSc) {
      $$('[data-showcase-step]', activeSc).forEach(function (item) {
        if (item.getAttribute('data-showcase-step') === String(stepNumber)) showItem = item;
        else hideItems.push(item);
      });
    }

    if (skipAnim) {
      hideItems.forEach(function (item) { item.hidden = true; });
      if (showItem) showItem.hidden = false;
    } else {
      crossfade(showItem, hideItems);
    }

    // Titik indikator di bawah showcase desktop — cuma showcase yang aktif itu.
    if (activeSc) {
      $$('.showcase__dot', activeSc).forEach(function (dot, i) {
        dot.classList.toggle('is-active', String(i + 1) === String(stepNumber));
      });
    }
  }

  (function initSteps() {
    var steps = $$('.step');
    if (!steps.length) return;

    steps.forEach(function (step) {
      step.addEventListener('click', function () {
        selectStep(step.getAttribute('data-step'));
        // Klik manual me-restart hitungan 5 detik showcase yang lagi aktif,
        // biar tidak langsung "kesambar" auto-advance sesaat setelah diklik.
        var sc = activeShowcase();
        if (sc && showcaseAutoplay[sc.id]) showcaseAutoplay[sc.id].start();
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
     3e. Helper "siapa yang benar-benar aktif" untuk showcase/carousel Cara
        Main. Situs ini dulunya punya switcher "Tema 1"/"Tema 2" di navbar
        (sudah dilepas atas permintaan — Tema 2 sekarang permanen, lihat §16
        di styles.css) — tapi markup Tema 1 (showcase Instastory/Mediopods,
        carousel-nya, dst.) masih ada di DOM, cuma disembunyikan lewat CSS
        `display:none` berbasis `data-theme` yang sekarang selalu "tema-2".

        `isVisible()` karena itu sengaja tidak cuma mengecek atribut `hidden`
        (mekanisme tab Instastory/Mediopods DI DALAM markup Tema 1 yang
        dormant itu) — showcase Tema 1 yang sedang "aktif" secara tab (tanpa
        atribut `hidden`) tetap harus dianggap TIDAK terlihat kalau leluhurnya
        `display:none`. `offsetParent === null` menutupi kedua kasus sekaligus
        (atribut ATAU CSS display, dari ancestor mana pun) tanpa perlu tahu
        markup mana yang sedang dormant.
     ------------------------------------------------------------------------ */
  function isVisible(el) {
    return !!el && !el.hidden && el.offsetParent !== null;
  }

  function activeShowcase() {
    var list = $$('.showcase:not([hidden])');
    for (var i = 0; i < list.length; i++) {
      if (isVisible(list[i])) return list[i];
    }
    return null;
  }

  function activeCarouselRoot() {
    var list = $$('[data-carousel]:not([hidden])');
    for (var i = 0; i < list.length; i++) {
      if (isVisible(list[i])) return list[i];
    }
    return null;
  }

  // Hentikan SEMUA timer, lalu nyalakan lagi cuma yang sedang benar-benar
  // aktif. `selectStep('1', true)` disamakan dengan perilaku initTabs():
  // setiap kali "cara main"-nya berganti (tab), mulai lagi dari langkah 1 —
  // supaya kontennya tidak mungkin nyasar menampilkan langkah N dari
  // showcase yang berbeda dari step-list yang sedang disorot. Dipanggil dari
  // gerbang scroll (§3f) begitu section-nya pertama kali kelihatan.
  function syncActivePlayMedia() {
    selectStep('1', true);

    Object.keys(showcaseAutoplay).forEach(function (id) { showcaseAutoplay[id].stop(); });
    Object.keys(carousels).forEach(function (id) { carousels[id].stop(); });

    var sc = activeShowcase();
    if (sc && showcaseAutoplay[sc.id]) showcaseAutoplay[sc.id].start();

    var cr = activeCarouselRoot();
    if (cr && carousels[cr.id]) {
      carousels[cr.id].reset();
      carousels[cr.id].start();
    }
  }

  /* ------------------------------------------------------------------------
     3f. Gerbang auto-slide "Cara Main" — baik showcase desktop maupun
        carousel mobile BARU mulai auto-advance setelah user benar-benar
        scroll sampai section ini terlihat, bukan langsung jalan sejak
        halaman dimuat (biar tidak ada slide yang "kelewat" sebelum user
        sempat melihatnya). Sekali section ini pernah kelihatan, observer-nya
        berhenti mengamati — perilaku start/stop selanjutnya (hover, ganti
        tab, klik langkah) tetap berjalan seperti biasa lewat
        syncActivePlayMedia() di atas.
     ------------------------------------------------------------------------ */
  (function initPlaySectionAutoplayGate() {
    var section = $('.play');
    if (!section || reduceMotion) return; // reduced-motion: start() sendiri sudah no-op

    if (!('IntersectionObserver' in window)) {
      syncActivePlayMedia();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        syncActivePlayMedia();
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
     4. Kondisi section Pengumuman Pemenang — "Ongoing" (kampanye masih
        berjalan) vs "Winner" (daftar pemenang sudah ada). Section-nya sendiri
        SELALU ada di DOM sekarang (tidak pernah `hidden` total seperti
        sebelumnya) — yang berubah cuma kontennya, lewat atribut
        `data-winners-state` pada `.slab--winners` (lihat styles.css §17).

        Default state ditentukan sama seperti gating lama (tanggal
        CAMPAIGN.winnersAnnouncedAt / query string), tapi sekarang bisa
        di-override manual lewat 2 tombol "Ongoing"/"Winner" di navbar
        (.state-switch, styles.css §3) — untuk keperluan preview stakeholder,
        makanya TIDAK disimpan ke localStorage (beda dari bekas theme-switch;
        ini alat bantu review, bukan preferensi pengguna).

        Preview manual lewat query string tetap seperti sebelumnya:
        ?preview=winners (paksa "winner")  ?preview=running (paksa "ongoing")

     ⚠️ SEMENTARA DIPAKSA "winner" untuk keperluan review desain & konten.
     JANGAN lupa set flag di bawah ini balik ke `false` sebelum go-live —
     tanpa ini, daftar pemenang akan terlihat publik sebelum periode kuis
     berakhir (walau datanya masih placeholder `agus***wati09@gmail.com`).
     ------------------------------------------------------------------------ */
  var DEV_ALWAYS_SHOW_WINNERS = true;

  (function initWinnersState() {
    var section = $('[data-winners]');
    if (!section) return;

    var VALID_STATES = ['ongoing', 'winner'];
    var btns = $$('[data-winners-btn]');

    function markActiveButton(state) {
      btns.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-winners-btn') === state);
      });
    }

    function setState(state) {
      if (VALID_STATES.indexOf(state) === -1) return;
      section.setAttribute('data-winners-state', state);
      markActiveButton(state);
    }

    var announceAt = new Date(CAMPAIGN.winnersAnnouncedAt).getTime();
    var defaultState;

    if (DEV_ALWAYS_SHOW_WINNERS) defaultState = 'winner';
    else if (previewMode === 'winners') defaultState = 'winner';
    else if (previewMode === 'running') defaultState = 'ongoing';
    else defaultState = (isFinite(announceAt) && Date.now() >= announceAt) ? 'winner' : 'ongoing';

    setState(defaultState);

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setState(btn.getAttribute('data-winners-btn'));
      });
    });
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
     6. Countdown — dipakai 2 tempat sekarang: "Dimulai dalam" di Hero Tema 2
        (target CAMPAIGN.startAt) dan "Akan diumumkan dalam" di section
        Pengumuman Pemenang kondisi "Ongoing" (target
        CAMPAIGN.winnersAnnouncedAt) — lihat styles.css §5 `.countdown` untuk
        tampilan dasarnya, §16/§17 untuk toggle tampil/sembunyinya masing-
        masing. Setiap elemen `[data-countdown-target]` punya timer sendiri,
        independen — target-nya adalah NAMA KEY di CAMPAIGN (bukan tanggal
        literal), dibaca dari atribut itu sendiri, supaya satu fungsi ini
        cukup untuk semua instance tanpa perlu tahu berapa banyak yang ada.

        Elemen disembunyikan otomatis begitu tanggal target-nya lewat — bukan
        berhenti di "0 Hari 0 Jam...", karena label "Dimulai dalam"/"Akan
        diumumkan dalam" tidak lagi relevan setelah itu.
     ------------------------------------------------------------------------ */
  (function initCountdowns() {
    $$('[data-countdown-target]').forEach(function (el) {
      var targetAt = new Date(CAMPAIGN[el.getAttribute('data-countdown-target')]).getTime();
      if (!isFinite(targetAt)) return;

      var fields = {
        days: $('[data-countdown="days"]', el),
        hours: $('[data-countdown="hours"]', el),
        minutes: $('[data-countdown="minutes"]', el),
        seconds: $('[data-countdown="seconds"]', el)
      };

      // Hari sengaja TIDAK dipad (samakan gaya "5" di Figma) — jumlah hari
      // sampai target tidak akan sebesar-besar itu, jadi tidak masalah kalau
      // lebih dari 1 digit. Jam/menit/detik dipad 2 digit supaya lebar
      // kotaknya tidak "loncat" tiap kali nilainya melewati batas 10 — Figma
      // cuma menunjukkan nilai sesaat (10, 3), bukan aturan padding yang
      // disengaja.
      function pad(n) { return n < 10 ? '0' + n : String(n); }

      function tick() {
        var diff = targetAt - Date.now();
        if (diff <= 0) {
          el.hidden = true;
          return false;
        }
        var totalSeconds = Math.floor(diff / 1000);
        fields.days.textContent = String(Math.floor(totalSeconds / 86400));
        fields.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
        fields.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
        fields.seconds.textContent = pad(totalSeconds % 60);
        return true;
      }

      if (!tick()) return; // sudah lewat sejak awal — jangan pasang interval
      var timer = window.setInterval(function () {
        if (!tick()) window.clearInterval(timer);
      }, 1000);
    });
  })();

})();
