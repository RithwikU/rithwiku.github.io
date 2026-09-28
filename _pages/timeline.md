---
layout: default
title: Timeline
permalink: /timeline/
description: Experience and education of Rithwik Udayagiri.
---
{%- assign t = site.data.timeline -%}
<section class="split section section-ruled">
  <div>
    <h6 class="eyebrow">Career telemetry</h6>
    <h1 class="display">Timeline</h1>
  </div>
  <div class="timeline">
    {%- for e in t.experience %}
    <div class="tl-row">
      <span class="tl-date">{{ e.dates }}</span>
      <div><div class="tl-title">{{ e.title }}</div><div class="tl-org">{{ e.org }}</div></div>
    </div>
    {%- endfor %}
    <div class="tl-row major">
      <span class="tl-date">Training</span>
      <div class="tl-training">
        {%- for ed in t.education %}
        <span><strong>{{ ed.degree }}</strong> — {{ ed.school }}, {{ ed.years }}</span>
        {%- endfor %}
      </div>
    </div>
  </div>
</section>
