// Travels map: D3 + world-atlas, pins from _data/travels.yml.
// Read-only by default. Add `?edit` to the URL for a local draft mode that
// keeps added/removed pins in localStorage and can copy them out as YAML.
// Each place is linkable as /travels/#<slug of its name>.
(function () {
  var KEY = 'ru-travels-v1';
  var ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/';
  var DEFAULTS = JSON.parse(document.getElementById('travels-data').textContent);
  var BASE = document.querySelector('.travels-map').dataset.base || '/';
  var EDIT = new URLSearchParams(location.search).has('edit');
  var KINDS = { home: 0, lived: 1, visited: 2 };
  var LABEL = { home: 'Home', lived: 'Lived', visited: 'Visited' };
  var LAT = [-50, 75]; // default view: inhabited latitudes, filling the stage top to bottom

  function load() {
    if (!EDIT) return DEFAULTS.slice();
    try { return JSON.parse(localStorage.getItem(KEY)) || DEFAULTS.slice(); } catch (e) { return DEFAULTS.slice(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(places)); } catch (e) { /* storage unavailable */ }
  }

  var places = load();
  var sel = -1, adding = false, countries = [], k = 1;

  var stage = document.getElementById('map-stage');
  var tip = document.getElementById('map-tip');
  var svg = d3.select('#map');
  var root = svg.append('g'), gCountries = root.append('g'), gPins = root.append('g');
  var projection = d3.geoNaturalEarth1(), path = d3.geoPath(projection);
  var zoom = d3.zoom().on('zoom', function (e) {
    k = e.transform.k; root.attr('transform', e.transform); drawPins();
  });
  svg.call(zoom).on('dblclick.zoom', null);

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  var keyOf = function (d) { return d.name + d.lat + d.lng; };
  var kindOf = function (d) { return KINDS.hasOwnProperty(d.kind) ? d.kind : 'visited'; };
  // Same result as Jekyll's `slugify`, so other pages can link to a place.
  var slug = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  var url = function (src) { return /^(https?:)?\/\//.test(src) ? src : BASE + src.replace(/^\//, ''); };

  // Default framing: as tall as the stage allows, centred on the pins and wide enough to show them all.
  // Zooming out (below 1) reveals the rest of the world.
  function size() {
    var w = stage.clientWidth, h = stage.clientHeight, pad = 12;
    var lngs = places.map(function (d) { return d.lng; });
    var west = Math.min.apply(null, lngs.concat(-30)), east = Math.max.apply(null, lngs.concat(30));
    projection.scale(1).translate([0, 0]);
    var y = function (lat) { return projection([0, lat])[1]; }, x = function (lng) { return projection([lng, 0])[0]; };
    var worldW = x(180) - x(-180);
    var s = Math.min((h - 2 * pad) / (y(LAT[0]) - y(LAT[1])), (w - 120) / (x(east) - x(west)));
    s = Math.max(s, (w - 2 * pad) / worldW);
    projection.scale(s);
    projection.translate([w / 2 - (x((west + east) / 2)), h / 2 - (y(LAT[0]) + y(LAT[1])) / 2]);
    var x0 = x(-180), x1 = x(180), y0 = y(85), y1 = y(-60);
    zoom.extent([[0, 0], [w, h]])
      .scaleExtent([Math.min(1, (w - 2 * pad) / (x1 - x0)), 24])
      .translateExtent([[Math.min(x0, 0), Math.min(y0, 0)], [Math.max(x1, w), Math.max(y1, h)]]);
    root.selectAll('path').attr('d', path);
    drawPins();
  }

  function countryOf(p) {
    if (p._c !== undefined && p._cn === countries.length) return p._c;
    var c = countries.find(function (f) { return d3.geoContains(f, [p.lng, p.lat]); });
    p._cn = countries.length; p._c = c ? c.properties.name : null;
    return p._c;
  }
  // Cached on each place; keep the cache out of copied YAML and saved drafts.
  var clean = function (p) { var o = {}; for (var q in p) if (q[0] !== '_') o[q] = p[q]; return o; };

  function showTip(html) { tip.innerHTML = html; tip.style.display = 'block'; }
  function moveTip(e) {
    var r = stage.getBoundingClientRect(), x = e.clientX - r.left + 14, y = e.clientY - r.top + 14;
    tip.style.left = Math.min(x, r.width - tip.offsetWidth - 8) + 'px';
    tip.style.top = Math.min(y, r.height - tip.offsetHeight - 8) + 'px';
  }
  function hideTip() { tip.style.display = 'none'; }

  function select(i, fly) {
    sel = i;
    var d = places[i];
    if (d) {
      history.replaceState(null, '', '#' + slug(d.name));
      if (fly) focus(d);
    } else {
      history.replaceState(null, '', location.pathname + location.search);
    }
    render();
  }

  function render() {
    var visited = new Set(places.map(countryOf).filter(Boolean));
    gCountries.selectAll('.country').classed('visited', function (d) { return visited.has(d.properties.name); });
    document.getElementById('n-places').textContent = places.length;
    if (countries.length) document.getElementById('n-countries').textContent = visited.size;

    var list = d3.select('#map-list').selectAll('li').data(places, keyOf).join(function (enter) {
      var li = enter.append('li').attr('tabindex', 0);
      li.append('span').attr('class', 'sq');
      var nm = li.append('div').attr('class', 'nm'); nm.append('b'); nm.append('span');
      li.append('span').attr('class', 'cam');
      if (EDIT) li.append('button').attr('type', 'button').attr('class', 'x').attr('title', 'Remove').attr('aria-label', 'Remove').text('×');
      return li;
    });
    list.classed('sel', function (d) { return places.indexOf(d) === sel; })
      .on('click', function (e, d) { select(places.indexOf(d), true); })
      .on('keydown', function (e, d) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(places.indexOf(d), true); } });
    list.select('.sq').attr('class', function (d) { return 'sq k-' + kindOf(d); });
    list.select('b').text(function (d) { return d.name; });
    list.select('.nm span').text(function (d) { return [d.note || LABEL[kindOf(d)], d.when].filter(Boolean).join(' · '); });
    list.select('.cam').text(function (d) { var n = (d.photos || []).length; return n ? n + (n > 1 ? ' photos' : ' photo') : ''; });
    list.select('.x').on('click', function (e, d) {
      e.stopPropagation(); places.splice(places.indexOf(d), 1); select(-1); save();
    });
    drawCard();
    drawPins();
  }

  function drawCard() {
    var card = document.getElementById('map-card'), d = places[sel];
    card.hidden = !d;
    if (!d) return;
    var photos = d.photos || [];
    document.getElementById('card-photos').innerHTML = photos.map(function (p) {
      return '<img src="' + esc(url(p.src)) + '" alt="' + esc(p.alt || '') + '" loading="lazy">';
    }).join('');
    document.getElementById('card-photos').hidden = !photos.length;
    document.getElementById('card-meta').textContent =
      [LABEL[kindOf(d)], countryOf(d), d.when].filter(Boolean).join(' · ');
    document.getElementById('card-name').textContent = d.name;
    document.getElementById('card-note').textContent = d.note || '';
    var album = document.getElementById('card-album');
    album.hidden = !d.album;
    if (d.album) album.href = d.album;
  }

  function drawPins() {
    var s = 9 / k;
    var order = places.map(function (d, i) { return i; }).sort(function (a, b) {
      return (b === sel) - (a === sel) || KINDS[kindOf(places[a])] - KINDS[kindOf(places[b])];
    });
    var pins = gPins.selectAll('.pin').data(places, keyOf).join(function (enter) {
      var g = enter.append('g').style('cursor', 'pointer');
      g.append('rect').attr('class', 'ring'); g.append('rect').attr('class', 'dot'); g.append('text');
      return g;
    });
    pins.attr('class', function (d) { return 'pin k-' + kindOf(d) + (places.indexOf(d) === sel ? ' sel' : ''); })
      .attr('transform', function (d) { var p = projection([d.lng, d.lat]); return 'translate(' + p[0] + ',' + p[1] + ')'; })
      .on('mouseenter', function (e, d) { showTip('<b>' + esc(d.name) + '</b>' + esc(d.note || '')); })
      .on('mousemove', moveTip)
      .on('mouseleave', hideTip)
      .on('click', function (e, d) { e.stopPropagation(); hideTip(); select(places.indexOf(d), false); });
    pins.select('.dot').attr('x', -s / 2).attr('y', -s / 2).attr('width', s).attr('height', s);
    pins.select('.ring').attr('x', -s).attr('y', -s).attr('width', 2 * s).attr('height', 2 * s);
    // Selected pin draws on top.
    pins.filter(function (d) { return places.indexOf(d) === sel; }).raise();

    // Labels: the selected place always, others once zoomed in, skipping any that would overlap.
    var boxes = [], shown = new Set();
    order.forEach(function (i) {
      var d = places[i];
      if (i !== sel && k < 3) return;
      var p = projection([d.lng, d.lat]), x = p[0] * k, y = p[1] * k;
      var b = [x - 6, y - 8, x + 12 + d.name.length * 6.4, y + 8];
      if (i !== sel && boxes.some(function (o) { return b[0] < o[2] && o[0] < b[2] && b[1] < o[3] && o[1] < b[3]; })) return;
      boxes.push(b); shown.add(i);
    });
    pins.select('text').attr('x', s * 0.9).attr('y', s * 0.35).attr('font-size', 11 / k).style('stroke-width', 3 / k)
      .text(function (d) { return shown.has(places.indexOf(d)) ? d.name : ''; });
  }

  function focus(d) {
    var p = projection([d.lng, d.lat]), w = stage.clientWidth, h = stage.clientHeight, s = Math.max(k, 4);
    svg.transition().duration(700).call(zoom.transform, d3.zoomIdentity.translate(w / 2 - p[0] * s, h / 2 - p[1] * s).scale(s));
  }

  document.getElementById('zin').onclick = function () { svg.transition().call(zoom.scaleBy, 1.6); };
  document.getElementById('zout').onclick = function () { svg.transition().call(zoom.scaleBy, 1 / 1.6); };
  document.getElementById('zreset').onclick = function () { svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity); };
  document.getElementById('card-close').onclick = function () { select(-1); };
  svg.on('click', function () { if (!adding && sel >= 0) select(-1); });

  if (EDIT) {
    var form = document.getElementById('map-form');
    var fName = document.getElementById('f-name'), fLat = document.getElementById('f-lat');
    var fLng = document.getElementById('f-lng'), fNote = document.getElementById('f-note');
    var pick = document.getElementById('pick');
    form.hidden = false;
    document.querySelectorAll('.edit-only').forEach(function (el) { el.hidden = false; });

    var setAdding = function (v) {
      adding = v; stage.classList.toggle('adding', v); pick.textContent = v ? 'Cancel' : 'Pick on map';
    };
    pick.onclick = function () { setAdding(!adding); };
    svg.on('click', function (e) {
      if (!adding) { if (sel >= 0) select(-1); return; }
      var t = d3.zoomTransform(svg.node()), m = d3.pointer(e, svg.node());
      var ll = projection.invert(t.invert(m));
      if (!ll || !isFinite(ll[1])) return;
      fLat.value = ll[1].toFixed(4); fLng.value = ll[0].toFixed(4);
      setAdding(false); fName.focus();
    });
    save = (function (inner) {
      return function () { var keep = places; places = places.map(clean); inner(); places = keep; };
    })(save);
    form.onsubmit = function (e) {
      e.preventDefault();
      var p = { name: fName.value.trim(), lat: +fLat.value, lng: +fLng.value, note: fNote.value.trim() };
      if (!p.name || !isFinite(p.lat) || !isFinite(p.lng)) return;
      places.push(p); save(); form.reset(); select(places.length - 1, true);
    };
    document.getElementById('copy-yaml').onclick = function () {
      var q = function (s) { return JSON.stringify(String(s)); };
      var yaml = places.map(function (p) {
        var out = '- name: ' + q(p.name) + '\n  lat: ' + p.lat + '\n  lng: ' + p.lng;
        ['kind', 'when', 'note', 'album'].forEach(function (f) { if (p[f]) out += '\n  ' + f + ': ' + q(p[f]); });
        (p.photos || []).forEach(function (ph, i) {
          out += (i ? '' : '\n  photos:') + '\n    - src: ' + q(ph.src) + (ph.alt ? '\n      alt: ' + q(ph.alt) : '');
        });
        return out;
      }).join('\n') + '\n';
      var btn = this;
      navigator.clipboard.writeText(yaml).then(function () {
        btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy as YAML'; }, 1500);
      });
    };
  }

  function drawCountries(topo) {
    countries = topojson.feature(topo, topo.objects.countries).features
      .filter(function (f) { return f.id !== '010'; }); // Antarctica
    gCountries.selectAll('.country').data(countries, function (d) { return d.id + d.properties.name; }).join('path')
      .attr('class', 'country')
      .on('mouseenter', function (e, d) { if (!adding) showTip('<b>' + esc(d.properties.name) + '</b>'); })
      .on('mousemove', moveTip)
      .on('mouseleave', hideTip);
    gPins.raise();
    size(); render();
  }

  // Arriving on /travels/#some-place opens that place.
  var fromHash = places.findIndex(function (d) { return slug(d.name) === decodeURIComponent(location.hash.slice(1)); });
  sel = fromHash;
  render();
  gCountries.append('path').datum({ type: 'Sphere' }).attr('class', 'sphere');
  gCountries.append('path').datum(d3.geoGraticule10()).attr('class', 'grat');
  // Coarse outlines first so the map appears quickly, then sharper coastlines for zooming in.
  d3.json(ATLAS + 'countries-110m.json').then(function (topo) {
    drawCountries(topo);
    if (fromHash >= 0) focus(places[fromHash]);
    return d3.json(ATLAS + 'countries-50m.json');
  }).then(drawCountries).catch(function () { /* keep whatever loaded */ });
  new ResizeObserver(size).observe(stage);
})();
