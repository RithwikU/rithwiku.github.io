// Travels map: D3 + world-atlas, pins from _data/travels.yml.
// Read-only by default. Add `?edit` to the URL for a local draft mode that
// keeps added/removed pins in localStorage and can copy them out as YAML.
(function () {
  var KEY = 'ru-travels-v1';
  var DEFAULTS = JSON.parse(document.getElementById('travels-data').textContent);
  var EDIT = new URLSearchParams(location.search).has('edit');

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
  var zoom = d3.zoom().scaleExtent([1, 12]).on('zoom', function (e) {
    k = e.transform.k; root.attr('transform', e.transform); drawPins();
  });
  svg.call(zoom);

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  var keyOf = function (d) { return d.name + d.lat + d.lng; };

  function size() {
    var w = stage.clientWidth, h = stage.clientHeight;
    projection.fitExtent([[16, 16], [w - 16, h - 16]], { type: 'Sphere' });
    root.selectAll('path').attr('d', path);
    drawPins();
  }

  function countryOf(p) {
    var c = countries.find(function (f) { return d3.geoContains(f, [p.lng, p.lat]); });
    return c ? c.properties.name : null;
  }

  function showTip(html) { tip.innerHTML = html; tip.style.display = 'block'; }
  function moveTip(e) {
    var r = stage.getBoundingClientRect();
    tip.style.left = (e.clientX - r.left + 14) + 'px';
    tip.style.top = (e.clientY - r.top + 14) + 'px';
  }
  function hideTip() { tip.style.display = 'none'; }

  function render() {
    var visited = new Set(places.map(countryOf).filter(Boolean));
    gCountries.selectAll('.country').classed('visited', function (d) { return visited.has(d.properties.name); });
    document.getElementById('n-places').textContent = places.length;
    if (countries.length) document.getElementById('n-countries').textContent = visited.size;

    var list = d3.select('#map-list').selectAll('li').data(places, keyOf).join(function (enter) {
      var li = enter.append('li');
      li.append('span').attr('class', 'sq');
      var nm = li.append('div').attr('class', 'nm'); nm.append('b'); nm.append('span');
      if (EDIT) li.append('button').attr('type', 'button').attr('class', 'x').attr('title', 'Remove').attr('aria-label', 'Remove').text('×');
      return li;
    });
    list.classed('sel', function (d) { return places.indexOf(d) === sel; })
      .on('click', function (e, d) { sel = places.indexOf(d); focus(d); render(); });
    list.select('b').text(function (d) { return d.name; });
    list.select('.nm span').text(function (d) { return d.note || d.lat.toFixed(2) + ', ' + d.lng.toFixed(2); });
    list.select('.x').on('click', function (e, d) {
      e.stopPropagation(); places.splice(places.indexOf(d), 1); sel = -1; save(); render();
    });
    drawPins();
  }

  function drawPins() {
    var s = 9 / k;
    var pins = gPins.selectAll('.pin').data(places, keyOf).join(function (enter) {
      var g = enter.append('g').attr('class', 'pin').style('cursor', 'pointer');
      g.append('rect'); g.append('text');
      return g;
    });
    pins.classed('sel', function (d) { return places.indexOf(d) === sel; })
      .attr('transform', function (d) { var p = projection([d.lng, d.lat]); return 'translate(' + p[0] + ',' + p[1] + ')'; })
      .on('mouseenter', function (e, d) { showTip('<b>' + esc(d.name) + '</b>' + esc(d.note || '')); })
      .on('mousemove', moveTip)
      .on('mouseleave', hideTip)
      .on('click', function (e, d) { e.stopPropagation(); sel = places.indexOf(d); render(); });
    pins.select('rect').attr('x', -s / 2).attr('y', -s / 2).attr('width', s).attr('height', s).attr('stroke-width', 1.5 / k);
    pins.select('text').attr('x', s * 0.9).attr('y', s * 0.35).attr('font-size', 11 / k).style('stroke-width', 3 / k)
      .text(function (d) { return (places.indexOf(d) === sel || k >= 3) ? d.name : ''; });
  }

  function focus(d) {
    var p = projection([d.lng, d.lat]), w = stage.clientWidth, h = stage.clientHeight, s = Math.max(k, 4);
    svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity.translate(w / 2 - p[0] * s, h / 2 - p[1] * s).scale(s));
  }

  document.getElementById('zin').onclick = function () { svg.transition().call(zoom.scaleBy, 1.6); };
  document.getElementById('zout').onclick = function () { svg.transition().call(zoom.scaleBy, 1 / 1.6); };
  document.getElementById('zreset').onclick = function () { svg.transition().call(zoom.transform, d3.zoomIdentity); };

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
      if (!adding) return;
      var t = d3.zoomTransform(svg.node()), m = d3.pointer(e, svg.node());
      var ll = projection.invert(t.invert(m));
      if (!ll || !isFinite(ll[1])) return;
      fLat.value = ll[1].toFixed(4); fLng.value = ll[0].toFixed(4);
      setAdding(false); fName.focus();
    });
    form.onsubmit = function (e) {
      e.preventDefault();
      var p = { name: fName.value.trim(), lat: +fLat.value, lng: +fLng.value, note: fNote.value.trim() };
      if (!p.name || !isFinite(p.lat) || !isFinite(p.lng)) return;
      places.push(p); sel = places.length - 1; save(); form.reset(); render(); focus(p);
    };
    document.getElementById('copy-yaml').onclick = function () {
      var q = function (s) { return JSON.stringify(String(s)); };
      var yaml = places.map(function (p) {
        return '- name: ' + q(p.name) + '\n  lat: ' + p.lat + '\n  lng: ' + p.lng + (p.note ? '\n  note: ' + q(p.note) : '');
      }).join('\n') + '\n';
      var btn = this;
      navigator.clipboard.writeText(yaml).then(function () {
        btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy as YAML'; }, 1500);
      });
    };
  }

  render();
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(function (topo) {
    countries = topojson.feature(topo, topo.objects.countries).features;
    gCountries.insert('path', ':first-child').datum(d3.geoGraticule10()).attr('class', 'grat');
    gCountries.insert('path', ':first-child').datum({ type: 'Sphere' }).attr('class', 'sphere');
    gCountries.selectAll('.country').data(countries).join('path').attr('class', 'country')
      .on('mouseenter', function (e, d) { if (!adding) showTip('<b>' + esc(d.properties.name) + '</b>'); })
      .on('mousemove', moveTip)
      .on('mouseleave', hideTip);
    size(); render();
  });
  new ResizeObserver(size).observe(stage);
})();
