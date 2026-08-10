/* =============================================================
   Jason & Yvonne — 前端互動
   內容一律讀 assets/js/config.js，這支檔案通常不用改
   ============================================================= */
(function () {
  'use strict';

  var CFG = window.WEDDING_CONFIG || {};
  var TZ = 'Asia/Taipei';
  var start = CFG.startAt ? new Date(CFG.startAt) : null;
  var end = CFG.endAt ? new Date(CFG.endAt) : null;

  /* ---------- 小工具 ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // 依路徑取值，例如 get('venue.name')
  function get(path) {
    return path.split('.').reduce(function (obj, key) {
      return (obj === null || obj === undefined) ? undefined : obj[key];
    }, CFG);
  }

  function parts(date) {
    var f = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short'
    });
    var out = {};
    f.formatToParts(date).forEach(function (p) { out[p.type] = p.value; });
    return out;
  }

  var WEEKDAY_TW = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  /* ---------- 日期格式 ---------- */
  var FMT = {};
  if (start) {
    var p = parts(start);
    var h24 = parseInt(p.hour, 10);
    var h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    var ampm = h24 < 12 ? 'AM' : 'PM';

    FMT.dateDot = p.year + '.' + p.month + '.' + p.day;              // 2026.11.08
    FMT.dateTw = p.year + ' 年 ' + (+p.month) + ' 月 ' + (+p.day) + ' 日';
    FMT.weekday = WEEKDAY_TW[new Date(p.year + '-' + p.month + '-' + p.day + 'T12:00:00+08:00').getUTCDay()];
    FMT.time12 = h12 + ':' + p.minute + ' ' + ampm;                  // 12:00 PM
    // 12 點要說「中午」，不是「下午」
    var period = h24 === 12 ? '中午' : (h24 < 12 ? '上午' : '下午');
    FMT.timeTw = period + ' ' + h12 + ':' + p.minute;                // 中午 12:00

    // 出席回覆截止日：優先用 config 的 rsvpDeadline，沒設才用婚期前 30 天
    var raw = String(CFG.rsvpDeadline == null ? '' : CFG.rsvpDeadline).trim();
    var dl = null;
    if (raw) {
      // 只給 YYYY-MM-DD 時補上台灣時區的正午，避免時區把日期推移一天
      dl = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw + 'T12:00:00+08:00' : raw);
      if (isNaN(dl.getTime())) {
        if (window.console && console.warn) {
          console.warn('[喜帖] rsvpDeadline 格式看不懂：' + raw + '　→ 請用 YYYY-MM-DD。');
        }
        dl = null;
      }
    }
    if (!dl) dl = new Date(start.getTime() - 30 * 864e5);

    var dp = parts(dl);
    var dlWeek = WEEKDAY_TW[new Date(dp.year + '-' + dp.month + '-' + dp.day + 'T12:00:00+08:00').getUTCDay()];
    // 括號用半角，和 Google 表單裡的寫法一致
    FMT.deadline = dp.year + ' 年 ' + (+dp.month) + ' 月 ' + (+dp.day) + ' 日(' + dlWeek + ')';
  }

  /* ---------- 把 config 綁到畫面上 ---------- */
  function bind() {
    $$('[data-bind]').forEach(function (el) {
      var key = el.getAttribute('data-bind');
      var val = key.indexOf('fmt.') === 0 ? FMT[key.slice(4)] : get(key);
      if (val !== undefined && val !== null && val !== '') el.textContent = val;
    });

    // 頁面標題
    var g = get('couple.groom.name'), b = get('couple.bride.name');
    if (g && b) document.title = g + ' & ' + b + ' ・ 我們結婚了';
  }

  /* ---------- Logo ----------
     導覽列與封面的 logo，載入失敗時導覽列退回文字縮寫          */
  function logos() {
    var cfg = CFG.brand || {};
    var alt = cfg.alt || '';

    var navImg = $('#navLogo');
    if (navImg) {
      var fallback = $('.nav__mark-text');
      navImg.addEventListener('error', function () {
        navImg.hidden = true;
        if (fallback) fallback.hidden = false;
        if (window.console && console.warn) {
          console.warn('[喜帖] 導覽列 logo 載入失敗：' + navImg.getAttribute('src'));
        }
      });
      if (alt) navImg.alt = alt;
      if (cfg.logo && cfg.logo !== navImg.getAttribute('src')) navImg.src = cfg.logo;
    }

    var coverLogo = $('#coverLogo');
    if (coverLogo) {
      var big = cfg.logoLarge || cfg.logo;
      coverLogo.addEventListener('error', function () {
        coverLogo.style.display = 'none';
      });
      if (alt) coverLogo.alt = alt;
      if (big && big !== coverLogo.getAttribute('src')) coverLogo.src = big;
    }

    // 結語區（深色底）用淺色版 logo，載入失敗才退回文字縮寫
    var closingLogo = $('#closingLogo');
    if (closingLogo) {
      var light = cfg.logoLight || cfg.logoLarge || cfg.logo;
      var closingText = $('.closing__mark-text');
      closingLogo.addEventListener('error', function () {
        closingLogo.hidden = true;
        if (closingText) closingText.hidden = false;
        if (window.console && console.warn) {
          console.warn('[喜帖] 結語區 logo 載入失敗：' + closingLogo.getAttribute('src'));
        }
      });
      if (alt) closingLogo.alt = alt;
      if (light && light !== closingLogo.getAttribute('src')) closingLogo.src = light;
    }
  }

  /* ---------- 封面照片 ----------
     用 object-fit: contain 完整顯示，不做任何裁切。
     照片成功載入才加 has-photo，檔案不存在時封面自動變回純文字版型。 */
  function coverPhoto() {
    var cover = $('#top');
    var figure = $('#coverPhoto');
    var cfg = CFG.heroPhoto || {};
    var src = (cfg.src || '').trim();
    if (!cover || !figure || !src) return;

    var img = document.createElement('img');
    img.alt = cfg.alt || '';
    img.decoding = 'async';
    img.setAttribute('fetchpriority', 'high');

    img.addEventListener('load', function () {
      // has-photo 會把 .cover__photo 從 display:none 變成 block。
      // 從 display:none 起跳的 transition 不會執行，所以要等瀏覽器
      // 先完成一次繪製，下一格再加 is-ready，進場特效才跑得起來。
      cover.classList.add('has-photo');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          figure.classList.add('is-ready');
        });
      });
    });
    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.removeChild(img);
      if (window.console && console.warn) {
        console.warn('[喜帖] 找不到封面照片：' + src +
          '　→ 請確認檔案路徑，或修改 config.js 的 heroPhoto.src；' +
          '目前先顯示沒有照片的版型。');
      }
    });

    img.src = src;   // 監聽器先掛好再設 src，避免快取時漏掉 load
    figure.appendChild(img);
  }

  /* ---------- 倒數計時 ---------- */
  function countdown() {
    var box = $('#countdown');
    if (!box || !start) return;

    var slots = {
      days: $('[data-cd="days"]', box),
      hours: $('[data-cd="hours"]', box),
      minutes: $('[data-cd="minutes"]', box),
      seconds: $('[data-cd="seconds"]', box)
    };

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      var diff = start.getTime() - Date.now();

      if (diff <= 0) {
        box.classList.add('is-done');
        box.innerHTML = (end && Date.now() > end.getTime())
          ? 'Thank you for celebrating with us'
          : 'Today is the day';
        clearInterval(timer);
        return;
      }

      var s = Math.floor(diff / 1000);
      slots.days.textContent = Math.floor(s / 86400);
      slots.hours.textContent = pad(Math.floor(s % 86400 / 3600));
      slots.minutes.textContent = pad(Math.floor(s % 3600 / 60));
      slots.seconds.textContent = pad(s % 60);
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------- 導覽列 ---------- */
  function nav() {
    var bar = $('#nav');
    var links = $('#navLinks');
    var toggle = $('#navToggle');

    function onScroll() {
      if (bar) bar.classList.toggle('is-stuck', window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
      });
      // 點連結後自動收起
      $$('a', links).forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && links.classList.contains('is-open')) {
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    }

    // 捲到哪一段就把對應連結標亮
    var map = {};
    $$('a[href^="#"]', links).forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = id && document.getElementById(id);
      if (sec) map[id] = a;
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          Object.keys(map).forEach(function (id) { map[id].classList.remove('is-active'); });
          var active = map[en.target.id];
          if (active) active.classList.add('is-active');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
    }
  }

  /* ---------- 捲動進場 ---------- */
  function reveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.style.transitionDelay = (i % 4) * 90 + 'ms';
        el.classList.add('is-in');
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8%' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 取出網址 ----------
     容錯：整段 <iframe src="..." ...> 貼進設定檔也能用，
     直接把這種字串當網址會變成無效的相對路徑，連結就壞掉。      */
  function pickUrl(value) {
    var v = String(value == null ? '' : value).trim();
    if (!v) return '';

    // 貼了整段 HTML 標籤 → 取出 src="..." 的內容
    var m = v.match(/src\s*=\s*["']([^"']+)["']/i);
    if (m) v = m[1].trim();

    // 抓不到合法網址就出聲，不要靜靜壞掉
    if (!/^https?:\/\//i.test(v)) {
      if (window.console && console.warn) {
        console.warn('[喜帖] Google 表單網址看起來不對：' + v +
          '　→ 請貼 https:// 開頭的網址（或整段 <iframe> 也可以）。');
      }
      return '';
    }
    return v;
  }

  /* ---------- 出席回覆 ----------
     不嵌入表單，改用一顆按鈕開新視窗跳轉。                      */
  function rsvp() {
    var wrap = $('#rsvpAction');
    var btn = $('#rsvpBtn');
    var cfg = CFG.googleForm || {};

    // formUrl 優先；沒填就退回舊設定的 embedUrl
    var url = pickUrl(cfg.formUrl) || pickUrl(cfg.embedUrl);

    // embedded=true 是嵌入 iframe 專用的參數，開新視窗時要清掉
    if (url) {
      url = url.replace(/([?&])embedded=true(&|$)/i, '$1').replace(/[?&]$/, '');
    }

    if (url && btn) {
      btn.href = url;
      return;
    }
    if (!wrap) return;

    // 還沒設定表單時的引導畫面（自己看得到，賓客看到也不會壞）
    wrap.innerHTML =
      '<div class="form-notice">' +
        '<h3>還沒接上 Google 表單</h3>' +
        '<p>照下面三步做，這顆按鈕就會連到你的出席回覆表單。</p>' +
        '<ol>' +
          '<li>建立一份 Google 表單（建議欄位：姓名、是否出席、人數、素食需求、給新人的話）。</li>' +
          '<li>右上角「傳送」→ 點鏈結圖示 → 勾「縮短網址」→ 複製。</li>' +
          '<li>貼到 <code>assets/js/config.js</code> 的 <code>googleForm.formUrl</code>。</li>' +
        '</ol>' +
      '</div>';
  }

  /* ---------- 地圖 + 加入行事曆 ---------- */
  function actions() {
    var mapBtn = $('#mapBtn');
    var mapUrl = get('venue.mapUrl');
    if (mapBtn) {
      mapBtn.href = mapUrl || ('https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent([get('venue.name'), get('venue.address')].filter(Boolean).join(' ')));
    }

    // 飯店官方交通資訊頁；沒設定就把按鈕藏起來
    var transitBtn = $('#transitBtn');
    var transitUrl = get('venue.transitUrl');
    if (transitBtn) {
      if (transitUrl) transitBtn.href = transitUrl;
      else transitBtn.hidden = true;
    }
    $$('[data-transit-link]').forEach(function (a) {
      if (transitUrl) a.href = transitUrl;
      else a.removeAttribute('href');
    });

    var calBtn = $('#calendarBtn');
    if (!calBtn || !start) return;

    calBtn.addEventListener('click', function () {
      var stamp = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
      var g = get('couple.groom.name') || '';
      var b = get('couple.bride.name') || '';
      var title = g + ' & ' + b + ' 婚宴';
      var place = [get('venue.name'), get('venue.hall'), get('venue.address')].filter(Boolean).join(' ');
      var finish = end || new Date(start.getTime() + 3 * 36e5);

      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding Invitation//ZH-TW//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:' + stamp(start) + '-wedding@invitation',
        'DTSTAMP:' + stamp(new Date()),
        'DTSTART:' + stamp(start),
        'DTEND:' + stamp(finish),
        'SUMMARY:' + title,
        'LOCATION:' + place.replace(/,/g, '\\,'),
        'DESCRIPTION:期待與你見面。' + (location.href.split('#')[0]),
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'wedding-invitation.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  /* ---------- 啟動 ---------- */
  function init() {
    bind();
    logos();
    coverPhoto();
    countdown();
    nav();
    reveal();
    rsvp();
    actions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
