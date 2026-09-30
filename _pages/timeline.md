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
    <a class="btn btn-secondary btn-split resume-link" href="{{ t.resume | relative_url }}" target="_blank" rel="noopener">Résumé (PDF) <span aria-hidden="true">↗</span></a>
  </div>
  <div class="timeline">
    {%- for e in t.experience %}
    <div class="tl-row">
      <span class="tl-date">{{ e.dates }}</span>
      {%- if e.roles.size > 1 or e.grouped %}
      <div>
        <div class="tl-title">{{ e.org }}</div>
        <ol class="tl-roles">
          {%- for r in e.roles %}
          <li><div class="tl-role">{{ r.title }}</div><div class="tl-org">{{ r.dates }}</div></li>
          {%- endfor %}
        </ol>
      </div>
      {%- else %}
      <div><div class="tl-title">{{ e.roles[0].title }}</div><div class="tl-org">{{ e.org }}</div></div>
      {%- endif %}
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
