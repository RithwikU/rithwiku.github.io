---
layout: default
title: Workshop
permalink: /workshop/
description: Half-baked ideas and side experiments by Rithwik Udayagiri.
---
<section class="section">
  <div class="split">
    <div>
      <h6 class="eyebrow">Under construction</h6>
      <h1 class="display">The Workshop</h1>
    </div>
    <p class="lede lede-end">Half-baked ideas and side experiments.</p>
  </div>
  <div class="bays" id="bays">
    <article class="bay bay-live" id="pathfinder">
      <div class="bay-head">
        <span class="meta">Bay 01 · Live</span>
        <button type="button" class="bay-toggle" aria-expanded="false" aria-controls="pathfinder-body"><strong>Pathfinder</strong></button>
        <button type="button" class="btn btn-secondary bay-open-only" id="squiggle-clear">Clear</button>
        <button type="button" class="bay-close bay-open-only" aria-label="Close Pathfinder">×</button>
      </div>
      <p class="bay-teaser">Draw a path and watch a little robot chase it.</p>
      <div class="bay-body" id="pathfinder-body">
        <div class="squiggle-stage">
          <canvas id="squiggle" aria-label="Drawing area: draw a path and a small robot drives along it"></canvas>
          <span class="squiggle-hint meta" id="squiggle-hint">Draw a path for the robot</span>
        </div>
        <p class="bay-note">Draw any line and the robot chases a point just ahead of it on the path. It's a simple take on pure pursuit, the same steering method behind my F1TENTH car and autonomous go-kart.</p>
      </div>
      <span class="bay-cue meta" aria-hidden="true">Open +</span>
    </article>
    {%- for n in (2..3) %}
    <article class="bay" id="bay-0{{ n }}">
      <div class="bay-head">
        <span class="meta">Bay 0{{ n }}</span>
        <button type="button" class="bay-toggle" aria-expanded="false" aria-controls="bay-0{{ n }}-body"><strong>Idea marinating</strong></button>
        <button type="button" class="bay-close bay-open-only" aria-label="Close bay 0{{ n }}">×</button>
      </div>
      <p class="bay-teaser">Something's on the workbench.</p>
      <div class="bay-body" id="bay-0{{ n }}-body">
        <p class="bay-note">Nothing to play with yet. Check back soon.</p>
      </div>
      <span class="bay-cue meta" aria-hidden="true">Open +</span>
    </article>
    {%- endfor %}
  </div>
</section>
<script>
  // One bay open at a time; the open bay takes the large slot.
  (function () {
    var bays = [].slice.call(document.querySelectorAll('#bays .bay'));
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function setOpen(target) {
      var apply = function () {
        bays.forEach(function (b) {
          var open = b === target;
          b.classList.toggle('open', open);
          b.querySelector('.bay-toggle').setAttribute('aria-expanded', open);
        });
      };
      if (document.startViewTransition && !still) document.startViewTransition(apply); else apply();
    }
    bays.forEach(function (b, i) {
      b.style.viewTransitionName = 'bay-' + i;
      b.querySelector('.bay-toggle').addEventListener('click', function () { if (!b.classList.contains('open')) setOpen(b); });
      b.querySelector('.bay-close').addEventListener('click', function () { setOpen(null); b.querySelector('.bay-toggle').focus(); });
    });
  })();
</script>
<script src="{{ '/assets/js/squiggle.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
