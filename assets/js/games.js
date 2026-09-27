/* Daily Games launcher -- /games/
 *
 * Standalone, no dependencies, no backend. State lives in localStorage.
 *
 * Kept to ES6 on purpose: this file is minified at build time by jekyll-minifier
 * (uglifier with harmony: true), which parses ES6 but NOT ES2020. So no optional
 * chaining, no nullish coalescing, no object spread -- a parse error here fails
 * the whole site build.
 */
(function () {
  'use strict';

  var KEY_GAMES = 'dailyGames.v1';
  var KEY_PROG = 'dailyGames.prog.v1';
  var KEY_UI = 'dailyGames.ui.v1';

  var ACCENTS = [
    '#7aa2f7', '#9ece6a', '#e0af68', '#f7768e',
    '#bb9af7', '#7dcfff', '#ff9e64', '#a6adc8'
  ];

  var EMOJI_PICKS = [
    '\uD83C\uDFAE', '\uD83E\uDDE9', '\uD83C\uDFB2', '\uD83C\uDFAF',
    '\uD83D\uDCC8', '\uD83D\uDCC9', '\uD83D\uDD2A', '\uD83D\uDCA9',
    '\uD83C\uDF0D', '\uD83C\uDFA8', '\uD83E\uDDE0', '\uD83C\uDFB5',
    '\uD83C\uDFC0', '\u26BD', '\uD83C\uDF7F', '\uD83D\uDEA9',
    '\uD83D\uDD0D', '\uD83D\uDC1D', '\uD83C\uDF38', '\uD83D\uDCA1',
    '\uD83C\uDCCF', '\uD83D\uDD20', '\uD83E\uDDEE', '\uD83C\uDFC1'
  ];

  // Monochrome symbols: these take the tile's accent colour instead of being
  // fixed-colour emoji. See isSymbolGlyph below.
  var SYMBOL_PICKS = ['\u2B22', '\u2B21', '\u25C6', '\u25CF', '\u25B2', '\u2726', '\u25C8', '\u2715'];

  var SEED = [
    { name: 'Poople', url: 'https://poople.io/', glyph: '\uD83D\uDCA9', accent: '#e0af68' },
    { name: 'Dialed', url: 'https://dialed.gg/color?d=1&s=38.90', glyph: '\uD83C\uDFA8', accent: '#bb9af7' },
    { name: 'Magnitudle', url: 'https://magnitudle.com/', glyph: '\uD83D\uDCC8', accent: '#9ece6a' },
    { name: 'Cutle', url: 'https://pfiffel.com/cutle/', glyph: '\uD83D\uDD2A', accent: '#a6adc8' },
    { name: 'Hex Hunt', url: 'https://thehexhunt.com/', glyph: '\u2B22', accent: '#7dcfff' },
    { name: 'Worldle', url: 'https://worldle.teuteuf.fr/', glyph: '\uD83C\uDF0D', accent: '#7aa2f7' }
  ];

  /* ---------------------------------------------------------------- storage */

  // Safari in Private Browsing throws on write, and some configurations throw
  // on read too. Never let that blank the grid: fall back to memory.
  var storageBroken = false;

  function readJSON(key) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      if (!storageBroken) {
        storageBroken = true;
        var warn = document.getElementById('storage-warn');
        if (warn) warn.classList.add('is-shown');
      }
    }
  }

  /* ------------------------------------------------------------------ dates */

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  // Local calendar date. Deliberately not toISOString(), which is UTC and would
  // roll the day over mid-evening in a US timezone.
  function dayKey(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function todayKey() {
    return dayKey(new Date());
  }

  function yesterdayKey() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return dayKey(d);
  }

  /* ------------------------------------------------------------------ glyphs */

  // Ranges that are text-presentation by default, so tinting them with the
  // accent colour is safe and looks intentional. Anything outside these (real
  // colour emoji, mostly in the astral planes) is left to the font, which
  // ignores colour anyway. A monochrome glyph we fail to recognise simply
  // renders in the normal text colour -- graceful, not broken.
  var SYMBOL_RANGES = [
    [0x0000, 0x1fff],
    [0x2190, 0x22ff],
    [0x25a0, 0x25ff],
    [0x2b20, 0x2b2f]
  ];
  var SYMBOL_EXTRA = [0x2715, 0x2716, 0x2726, 0x2727, 0x2732, 0x2734];

  function codePoints(str) {
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var cp = str.codePointAt(i);
      out.push(cp);
      if (cp > 0xffff) i++;
    }
    return out;
  }

  function isSymbolGlyph(glyph) {
    var cps = codePoints(glyph);
    if (!cps.length) return false;
    for (var i = 0; i < cps.length; i++) {
      var cp = cps[i];
      var ok = SYMBOL_EXTRA.indexOf(cp) !== -1;
      for (var r = 0; !ok && r < SYMBOL_RANGES.length; r++) {
        if (cp >= SYMBOL_RANGES[r][0] && cp <= SYMBOL_RANGES[r][1]) ok = true;
      }
      if (!ok) return false;
    }
    return true;
  }

  /* -------------------------------------------------------------------- urls */

  function normalizeUrl(raw) {
    var s = String(raw == null ? '' : raw).trim();
    if (!s) return null;
    if (!/^[a-zA-Z][a-zA-Z0-9+.\-]*:/.test(s)) s = 'https://' + s;
    var u;
    try {
      u = new URL(s);
    } catch (err) {
      return null;
    }
    // Only ever hand an http(s) URL to an href. Rejects javascript:, data:, etc.
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (!u.hostname) return null;
    return u.href;
  }

  function titleCase(s) {
    return s.replace(/[-_]+/g, ' ')
      .split(' ')
      .filter(function (w) { return w.length > 0; })
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join(' ');
  }

  // Best-effort. The hostname alone is not enough: pfiffel.com/cutle/ is "Cutle",
  // not "Pfiffel". So prefer the last path segment, then the first host label
  // (worldle.teuteuf.fr -> "Worldle", magnitudle.com -> "Magnitudle").
  function deriveName(href) {
    var u;
    try {
      u = new URL(href);
    } catch (err) {
      return '';
    }

    var segs = u.pathname.split('/').filter(function (s) { return s.length > 0; });
    var base;

    if (segs.length) {
      base = segs[segs.length - 1].replace(/\.(html?|php|aspx?)$/i, '');
    } else {
      base = u.hostname.replace(/^www\./i, '').split('.')[0];
    }

    base = base.replace(/\+/g, ' ');
    try {
      base = decodeURIComponent(base);
    } catch (err) { /* leave as-is */ }

    // "thehexhunt" -> "hexhunt". Run-together names can't be split further
    // without a dictionary, so this is where best-effort stops.
    var stripped = base.replace(/^the(?=[a-z]{5})/i, '');
    if (stripped.length >= 3) base = stripped;

    return titleCase(base).slice(0, 40);
  }

  /* -------------------------------------------------------------------- state */

  var games = [];
  var progress = {};
  var ui = {};
  var editing = false;      // grid edit mode
  var sheetId = null;       // id being edited in the sheet, null when adding
  var nameTouched = false;

  function uid() {
    return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function seedGames() {
    return SEED.map(function (s) {
      return { id: uid(), name: s.name, url: s.url, glyph: s.glyph, accent: s.accent };
    });
  }

  function sanitizeGame(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var url = normalizeUrl(raw.url);
    if (!url) return null;
    var name = String(raw.name == null ? '' : raw.name).trim().slice(0, 40);
    if (!name) name = deriveName(url) || 'Game';
    var glyph = String(raw.glyph == null ? '' : raw.glyph).trim().slice(0, 4);
    if (!glyph) glyph = '\uD83C\uDFAE';
    var accent = /^#[0-9a-f]{6}$/i.test(raw.accent) ? raw.accent : ACCENTS[0];
    return {
      id: typeof raw.id === 'string' && raw.id ? raw.id : uid(),
      name: name,
      url: url,
      glyph: glyph,
      accent: accent
    };
  }

  function loadState() {
    var stored = readJSON(KEY_GAMES);

    if (stored === null) {
      // Absent, not merely empty: first ever run. An empty list the user made
      // on purpose must stay empty.
      games = seedGames();
      writeJSON(KEY_GAMES, { version: 1, games: games });
    } else {
      var list = stored && Array.isArray(stored.games) ? stored.games : [];
      games = list.map(sanitizeGame).filter(function (g) { return g !== null; });
    }

    var prog = readJSON(KEY_PROG);
    progress = prog && typeof prog === 'object' ? prog : {};

    var saved = readJSON(KEY_UI);
    ui = saved && typeof saved === 'object' ? saved : {};
  }

  function saveGames() {
    writeJSON(KEY_GAMES, { version: 1, games: games });
  }

  function saveProgress() {
    writeJSON(KEY_PROG, progress);
  }

  function saveUI() {
    writeJSON(KEY_UI, ui);
  }

  function indexOfId(id) {
    for (var i = 0; i < games.length; i++) {
      if (games[i].id === id) return i;
    }
    return -1;
  }

  function isDone(id) {
    var p = progress[id];
    return !!(p && p.last === todayKey());
  }

  function streakOf(id) {
    var p = progress[id];
    return p && typeof p.streak === 'number' ? p.streak : 0;
  }

  function markDone(id) {
    var today = todayKey();
    var p = progress[id];
    if (p && p.last === today) return;                  // idempotent
    var streak = p && p.last === yesterdayKey() && typeof p.streak === 'number' ? p.streak + 1 : 1;
    progress[id] = { last: today, streak: streak };
    saveProgress();
  }

  function markUndone(id) {
    var p = progress[id];
    if (!p || p.last !== todayKey()) return;
    // Undo the increment this tap caused, and leave the previous day intact so
    // a mis-tap doesn't cost a real streak.
    var streak = typeof p.streak === 'number' ? p.streak - 1 : 0;
    if (streak > 0) {
      progress[id] = { last: yesterdayKey(), streak: streak };
    } else {
      delete progress[id];
    }
    saveProgress();
  }

  /* --------------------------------------------------------------- rendering */

  var el = {};

  function cacheEls() {
    [
      'today-label', 'ring', 'ring-fill', 'ring-label', 'edit-toggle', 'grid',
      'empty', 'restore-defaults', 'hint', 'hint-close', 'sheet', 'sheet-backdrop',
      'sheet-title', 'sheet-cancel', 'sheet-form', 'sheet-error', 'sheet-save',
      'sheet-delete', 'f-url', 'f-name', 'f-glyph', 'glyph-picker', 'accent-picker'
    ].forEach(function (id) {
      el[id] = document.getElementById(id);
    });
  }

  function renderDate() {
    var d = new Date();
    var text;
    try {
      text = d.toLocaleDateString(undefined, {
        weekday: 'long', month: 'long', day: 'numeric'
      });
    } catch (err) {
      text = d.toDateString();
    }
    el['today-label'].textContent = text;
  }

  function renderProgress() {
    var total = games.length;
    var done = 0;
    for (var i = 0; i < games.length; i++) {
      if (isDone(games[i].id)) done++;
    }

    var circ = 2 * Math.PI * 20;
    var frac = total ? done / total : 0;
    el['ring-fill'].setAttribute('stroke-dasharray', String(circ));
    el['ring-fill'].setAttribute('stroke-dashoffset', String(circ * (1 - frac)));
    // A round line-cap still paints a dot at zero length, so hide the arc
    // outright rather than leaving a stray mark at 12 o'clock.
    el['ring-fill'].style.opacity = done > 0 ? '1' : '0';
    el['ring-label'].textContent = done + '/' + total;
    el.ring.setAttribute('aria-label', done + ' of ' + total + ' done today');
    el.ring.classList.toggle('is-complete', total > 0 && done === total);
  }

  function makeGlyphSpan(glyph, className) {
    var span = document.createElement('span');
    span.className = className + (isSymbolGlyph(glyph) ? ' is-symbol' : '');
    span.textContent = glyph;
    return span;
  }

  function buildCell(game, index) {
    var done = isDone(game.id);

    var li = document.createElement('li');
    li.className = 'cell' + (done ? ' is-done' : '');
    li.setAttribute('data-id', game.id);

    var a = document.createElement('a');
    a.className = 'tile';
    a.href = game.url;                 // already scheme-checked by sanitizeGame
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.setProperty('--tile-accent', game.accent);

    a.appendChild(makeGlyphSpan(game.glyph, 'tile-glyph'));

    var meta = document.createElement('span');
    meta.className = 'tile-meta';

    var name = document.createElement('span');
    name.className = 'tile-name';
    name.textContent = game.name;
    meta.appendChild(name);

    var streak = streakOf(game.id);
    if (streak > 1) {
      var st = document.createElement('span');
      st.className = 'tile-streak';
      st.textContent = streak + ' day streak';
      meta.appendChild(st);
    }

    a.appendChild(meta);
    li.appendChild(a);

    // Badge toggles done independently of opening -- the undo for a mis-tap.
    var badge = document.createElement('button');
    badge.type = 'button';
    badge.className = 'badge';
    badge.setAttribute('data-act', 'toggle');
    badge.setAttribute('aria-label', (done ? 'Mark ' + game.name + ' not done' : 'Mark ' + game.name + ' done'));
    badge.setAttribute('aria-pressed', done ? 'true' : 'false');
    var mark = document.createElement('span');
    mark.className = 'badge-mark';
    mark.textContent = done ? '\u2713' : '';
    badge.appendChild(mark);
    li.appendChild(badge);

    var bar = document.createElement('div');
    bar.className = 'edit-bar';

    var up = document.createElement('button');
    up.type = 'button';
    up.className = 'edit-btn';
    up.setAttribute('data-act', 'up');
    up.setAttribute('aria-label', 'Move ' + game.name + ' earlier');
    up.textContent = '\u2191';
    up.disabled = index === 0;
    bar.appendChild(up);

    var down = document.createElement('button');
    down.type = 'button';
    down.className = 'edit-btn';
    down.setAttribute('data-act', 'down');
    down.setAttribute('aria-label', 'Move ' + game.name + ' later');
    down.textContent = '\u2193';
    down.disabled = index === games.length - 1;
    bar.appendChild(down);

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'edit-btn is-danger';
    del.setAttribute('data-act', 'delete');
    del.setAttribute('aria-label', 'Delete ' + game.name);
    del.textContent = '\u2715';
    bar.appendChild(del);

    li.appendChild(bar);
    return li;
  }

  function buildAddCell() {
    var li = document.createElement('li');
    li.className = 'cell';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile tile-add';
    btn.setAttribute('data-act', 'add');

    var plus = document.createElement('span');
    plus.className = 'tile-glyph';
    plus.textContent = '+';
    btn.appendChild(plus);

    var label = document.createElement('span');
    label.className = 'tile-add-label';
    label.textContent = 'Add a game';
    btn.appendChild(label);

    li.appendChild(btn);
    return li;
  }

  function render() {
    var grid = el.grid;
    grid.textContent = '';
    games.forEach(function (game, i) {
      grid.appendChild(buildCell(game, i));
    });
    grid.appendChild(buildAddCell());

    document.body.classList.toggle('is-empty', games.length === 0);
    renderProgress();
  }

  /* ------------------------------------------------------------------- sheet */

  function setPressed(container, value) {
    var picks = container.querySelectorAll('[data-value]');
    for (var i = 0; i < picks.length; i++) {
      picks[i].setAttribute('aria-pressed', picks[i].getAttribute('data-value') === value ? 'true' : 'false');
    }
  }

  function buildPickers() {
    EMOJI_PICKS.concat(SYMBOL_PICKS).forEach(function (glyph) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pick' + (isSymbolGlyph(glyph) ? ' is-symbol' : '');
      b.setAttribute('data-value', glyph);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Icon ' + glyph);
      b.textContent = glyph;
      el['glyph-picker'].appendChild(b);
    });

    ACCENTS.forEach(function (colour) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch';
      b.style.background = colour;
      b.setAttribute('data-value', colour);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Colour ' + colour);
      el['accent-picker'].appendChild(b);
    });
  }

  function showError(msg) {
    el['sheet-error'].textContent = msg;
    el['sheet-error'].classList.toggle('is-shown', !!msg);
  }

  function openSheet(id) {
    sheetId = id || null;
    nameTouched = false;
    showError('');

    var game = null;
    if (sheetId) {
      var idx = indexOfId(sheetId);
      if (idx !== -1) game = games[idx];
    }

    if (game) {
      el['sheet-title'].textContent = 'Edit game';
      el['sheet-save'].textContent = 'Save';
      el['sheet-delete'].hidden = false;
      el['f-url'].value = game.url;
      el['f-name'].value = game.name;
      el['f-glyph'].value = game.glyph;
      setPressed(el['glyph-picker'], game.glyph);
      setPressed(el['accent-picker'], game.accent);
      nameTouched = true;
    } else {
      el['sheet-title'].textContent = 'Add a game';
      el['sheet-save'].textContent = 'Add game';
      el['sheet-delete'].hidden = true;
      el['f-url'].value = '';
      el['f-name'].value = '';
      el['f-glyph'].value = EMOJI_PICKS[0];
      setPressed(el['glyph-picker'], EMOJI_PICKS[0]);
      setPressed(el['accent-picker'], ACCENTS[games.length % ACCENTS.length]);
    }

    document.body.classList.add('sheet-open');
    el.sheet.setAttribute('aria-hidden', 'false');
    if (!game) {
      try { el['f-url'].focus(); } catch (err) { /* ignore */ }
    }
  }

  function closeSheet() {
    document.body.classList.remove('sheet-open');
    el.sheet.setAttribute('aria-hidden', 'true');
    sheetId = null;
    showError('');
  }

  function selectedValue(container, fallback) {
    var on = container.querySelector('[aria-pressed="true"]');
    return on ? on.getAttribute('data-value') : fallback;
  }

  function submitSheet() {
    var url = normalizeUrl(el['f-url'].value);
    if (!url) {
      showError('That does not look like a web address. Try something like example.com/game');
      return;
    }

    var name = el['f-name'].value.trim() || deriveName(url) || 'Game';
    var glyph = el['f-glyph'].value.trim() || selectedValue(el['glyph-picker'], EMOJI_PICKS[0]);
    var accent = selectedValue(el['accent-picker'], ACCENTS[0]);

    var next = sanitizeGame({
      id: sheetId || uid(),
      name: name,
      url: url,
      glyph: glyph,
      accent: accent
    });
    if (!next) {
      showError('Could not save that. Check the address and try again.');
      return;
    }

    var idx = sheetId ? indexOfId(sheetId) : -1;
    if (idx !== -1) {
      games[idx] = next;
    } else {
      games.push(next);
    }

    saveGames();
    closeSheet();
    render();
  }

  function deleteFromSheet() {
    var idx = sheetId ? indexOfId(sheetId) : -1;
    if (idx === -1) {
      closeSheet();
      return;
    }
    var id = games[idx].id;
    games.splice(idx, 1);
    delete progress[id];
    saveGames();
    saveProgress();
    closeSheet();
    render();
  }

  /* ------------------------------------------------------------------ events */

  function onGridClick(event) {
    var addBtn = event.target.closest('[data-act="add"]');
    if (addBtn) {
      openSheet(null);
      return;
    }

    var cell = event.target.closest('.cell[data-id]');
    if (!cell) return;
    var id = cell.getAttribute('data-id');

    var actionBtn = event.target.closest('[data-act]');
    var act = actionBtn ? actionBtn.getAttribute('data-act') : null;

    if (act === 'toggle') {
      if (isDone(id)) markUndone(id); else markDone(id);
      render();
      return;
    }

    if (act === 'up' || act === 'down') {
      var i = indexOfId(id);
      var j = act === 'up' ? i - 1 : i + 1;
      if (i === -1 || j < 0 || j >= games.length) return;
      var tmp = games[i];
      games[i] = games[j];
      games[j] = tmp;
      saveGames();
      render();
      return;
    }

    if (act === 'delete') {
      var k = indexOfId(id);
      if (k === -1) return;
      if (!window.confirm('Remove ' + games[k].name + '?')) return;
      games.splice(k, 1);
      delete progress[id];
      saveGames();
      saveProgress();
      render();
      return;
    }

    var tile = event.target.closest('a.tile');
    if (tile) {
      if (editing) {
        // In edit mode the tile body opens the editor rather than navigating.
        event.preventDefault();
        openSheet(id);
        return;
      }
      // Navigation is never blocked by bookkeeping: if this throws, the link
      // still opens.
      try {
        markDone(id);
        render();
      } catch (err) { /* ignore */ }
    }
  }

  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('is-editing', on);
    el['edit-toggle'].setAttribute('aria-pressed', on ? 'true' : 'false');
    el['edit-toggle'].textContent = on ? 'Done' : 'Edit';
    render();
  }

  function maybeShowHint() {
    var iosStandaloneKnown = 'standalone' in window.navigator;
    var installed = iosStandaloneKnown && window.navigator.standalone === true;
    if (installed || !iosStandaloneKnown) return;
    if (ui.hintDismissed) return;
    el.hint.classList.add('is-shown');
  }

  function wire() {
    el.grid.addEventListener('click', onGridClick);

    el['edit-toggle'].addEventListener('click', function () {
      setEditing(!editing);
    });

    el['restore-defaults'].addEventListener('click', function () {
      games = seedGames();
      saveGames();
      render();
    });

    el['hint-close'].addEventListener('click', function () {
      ui.hintDismissed = true;
      saveUI();
      el.hint.classList.remove('is-shown');
    });

    el['sheet-form'].addEventListener('submit', function (event) {
      event.preventDefault();
      submitSheet();
    });

    el['sheet-cancel'].addEventListener('click', closeSheet);
    el['sheet-backdrop'].addEventListener('click', closeSheet);
    el['sheet-delete'].addEventListener('click', deleteFromSheet);

    el['f-name'].addEventListener('input', function () {
      nameTouched = true;
    });

    function autofillName() {
      if (nameTouched && el['f-name'].value.trim()) return;
      var url = normalizeUrl(el['f-url'].value);
      if (!url) return;
      var guess = deriveName(url);
      if (guess) el['f-name'].value = guess;
    }

    el['f-url'].addEventListener('blur', autofillName);
    el['f-url'].addEventListener('change', autofillName);

    el['glyph-picker'].addEventListener('click', function (event) {
      var pick = event.target.closest('[data-value]');
      if (!pick) return;
      var value = pick.getAttribute('data-value');
      setPressed(el['glyph-picker'], value);
      el['f-glyph'].value = value;
    });

    el['f-glyph'].addEventListener('input', function () {
      setPressed(el['glyph-picker'], el['f-glyph'].value.trim());
    });

    el['accent-picker'].addEventListener('click', function (event) {
      var pick = event.target.closest('[data-value]');
      if (!pick) return;
      setPressed(el['accent-picker'], pick.getAttribute('data-value'));
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('sheet-open')) {
        closeSheet();
      }
    });

    // Coming back to the launcher the next morning should not show yesterday's
    // ticks. Re-render whenever the page is revealed and the date has moved on.
    var renderedDay = todayKey();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      if (todayKey() !== renderedDay) {
        renderedDay = todayKey();
        renderDate();
      }
      render();
    });
  }

  function init() {
    cacheEls();
    loadState();
    buildPickers();
    renderDate();
    render();
    wire();
    maybeShowHint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
