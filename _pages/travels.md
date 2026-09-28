---
layout: default
title: Travels
permalink: /travels/
description: Places Rithwik Udayagiri has been.
---
<section class="section">
  <div class="split travels-intro">
    <div>
      <h6 class="eyebrow">Places I've been</h6>
      <h1 class="display">Travels</h1>
    </div>
    <p class="lede">Drag to pan, scroll to zoom, hover a pin for details.<span class="edit-only" hidden> Add a place by typing its coordinates or picking it straight off the map.</span></p>
  </div>

  <div class="travels-map">
    <div class="map-stage" id="map-stage">
      <svg id="map" role="img" aria-label="World map with pins for places visited"></svg>
      <div class="map-ctrls">
        <button type="button" id="zin" title="Zoom in" aria-label="Zoom in">+</button>
        <button type="button" id="zout" title="Zoom out" aria-label="Zoom out">−</button>
        <button type="button" id="zreset" class="reset" title="Reset" aria-label="Reset zoom">⟲</button>
      </div>
      <div class="map-hint">Click the map to drop a pin</div>
      <div class="map-tip" id="map-tip"></div>
    </div>
    <div class="map-panel">
      <div class="map-stats">
        <div><span class="meta">Places</span><div class="map-num" id="n-places">{{ site.data.travels.size }}</div></div>
        <div><span class="meta">Countries</span><div class="map-num" id="n-countries">–</div></div>
      </div>
      <ul class="map-list" id="map-list"></ul>
      <form class="map-form" id="map-form" autocomplete="off" hidden>
        <span class="meta">Add a location</span>
        <input class="input" id="f-name" placeholder="Place name" aria-label="Place name" required>
        <div class="row">
          <input class="input" id="f-lat" placeholder="Lat" aria-label="Latitude" type="number" step="any" min="-90" max="90" required>
          <input class="input" id="f-lng" placeholder="Lng" aria-label="Longitude" type="number" step="any" min="-180" max="180" required>
        </div>
        <input class="input" id="f-note" placeholder="Note (optional)" aria-label="Note">
        <div class="row">
          <button type="button" class="btn btn-secondary" id="pick">Pick on map</button>
          <button type="submit" class="btn btn-primary btn-split">Add pin <span aria-hidden="true">+</span></button>
        </div>
        <button type="button" class="btn btn-secondary" id="copy-yaml">Copy as YAML</button>
      </form>
    </div>
  </div>
</section>

<script id="travels-data" type="application/json">{{ site.data.travels | jsonify }}</script>
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js" integrity="sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js" integrity="sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67" crossorigin="anonymous"></script>
<script src="{{ '/assets/js/travels.js' | relative_url }}"></script>
