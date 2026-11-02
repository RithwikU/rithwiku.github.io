---
layout: default
title: Workshop
permalink: /workshop/
description: Half-baked ideas and side experiments by Rithwik Udayagiri.
---
<section class="section section-ruled">
  <div class="split">
    <div>
      <h6 class="eyebrow">Under construction</h6>
      <h1 class="display">The Workshop</h1>
    </div>
    <p class="lede lede-end">Half-baked ideas and side experiments.</p>
  </div>
  <div class="bays">
    <div class="bay bay-live">
      <div class="bay-head">
        <span class="meta">Bay 01 · Live</span>
        <strong>Pathfinder</strong>
        <button type="button" class="btn btn-secondary" id="squiggle-clear">Clear</button>
      </div>
      <div class="squiggle-stage">
        <canvas id="squiggle" aria-label="Drawing area: draw a path and a small robot drives along it"></canvas>
        <span class="squiggle-hint meta" id="squiggle-hint">Draw a path for the robot</span>
      </div>
      <p class="bay-note">Draw any line and the robot chases a point just ahead of it on the path. It's a simple take on pure pursuit, the same steering method behind my F1TENTH car and autonomous go-kart.</p>
    </div>
    {%- for n in (2..3) %}
    <div class="bay">
      <span class="meta">Bay 0{{ n }}</span>
      <strong>Idea marinating</strong>
    </div>
    {%- endfor %}
  </div>
</section>
<script src="{{ '/assets/js/squiggle.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
