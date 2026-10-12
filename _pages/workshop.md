---
layout: default
title: Workshop
permalink: /workshop/
description: Interactive projects Rithwik Udayagiri is currently working on.
---
<section class="section section-ruled">
  <div class="split">
    <div>
      <h6 class="eyebrow">Under construction</h6>
      <h1 class="display">The Workshop</h1>
    </div>
    <p class="lede">Interactive projects I'm currently working on.</p>
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
        <span class="squiggle-hint meta" id="squiggle-hint">Draw a path. The robot will follow it.</span>
      </div>
      <p class="bay-note">The robot tracks your line with pure pursuit: it steers toward a point a little way ahead on the path, the same idea behind the F1TENTH and go-kart controllers.</p>
    </div>
    {%- for n in (2..3) %}
    <div class="bay">
      <span class="meta">Bay 0{{ n }}</span>
      <strong>Awaiting build_</strong>
    </div>
    {%- endfor %}
  </div>
</section>
<script src="{{ '/assets/js/squiggle.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
