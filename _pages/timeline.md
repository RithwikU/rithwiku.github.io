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
    <h6 class="tl-heading">Experience</h6>
    {%- for e in t.experience %}
    <div class="tl-row">
      <span class="tl-date">{{ e.dates }}</span>
      <div>
        <div class="tl-title">{{ e.org }}</div>
        <ol class="tl-roles">
          {%- for r in e.roles %}
          <li><div class="tl-role">{{ r.title }}</div>{% if e.roles.size > 1 %}<div class="tl-org">{{ r.dates }}</div>{% endif %}</li>
          {%- endfor %}
        </ol>
      </div>
    </div>
    {%- endfor %}
    <h6 class="tl-heading">Education</h6>
    {%- for ed in t.education %}
    <div class="tl-row{% if forloop.first %} major{% endif %}">
      <span class="tl-date">{{ ed.dates }}</span>
      <div>
        <div class="tl-title">{{ ed.school }}</div>
        <div class="tl-org">{{ ed.department }}</div>
        <ol class="tl-roles">
          <li><div class="tl-role">{{ ed.degree }}</div><div class="tl-org">GPA {{ ed.gpa }}</div></li>
        </ol>
        <ul class="tl-courses" aria-label="Coursework">
          {%- for c in ed.courses %}
          <li>{{ c }}</li>
          {%- endfor %}
        </ul>
      </div>
    </div>
    {%- endfor %}
  </div>
</section>
