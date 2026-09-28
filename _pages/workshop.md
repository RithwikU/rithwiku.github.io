---
layout: default
title: Workshop
permalink: /workshop/
description: Interactive experiments built into this site.
---
<section class="section section-ruled">
  <div class="split">
    <div>
      <h6 class="eyebrow">Under construction</h6>
      <h1 class="display">The Workshop</h1>
    </div>
    <p class="lede">Interactive experiments I'm building right into this site. Bays open as they come online.</p>
  </div>
  <div class="bays">
    {%- for n in (1..3) %}
    <div class="bay">
      <span class="meta">Bay 0{{ n }}</span>
      <strong>Awaiting build_</strong>
    </div>
    {%- endfor %}
  </div>
</section>
