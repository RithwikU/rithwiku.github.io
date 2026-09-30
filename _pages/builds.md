---
layout: default
title: Builds
permalink: /builds/
description: Robots, racers and side projects by Rithwik Udayagiri.
---
{%- assign builds = site.projects | sort: "importance" -%}
<section class="section">
  <div class="builds-head">
    <div>
      <h6 class="eyebrow">Build archive · {{ builds.size }} entries</h6>
      <h1 class="display">Builds</h1>
    </div>
    <div class="seg" role="radiogroup" aria-label="Filter builds">
      <label class="seg-opt"><input type="radio" name="build-filter" value="all" checked>All</label>
      <label class="seg-opt"><input type="radio" name="build-filter" value="work">Work</label>
      <label class="seg-opt"><input type="radio" name="build-filter" value="fun">Fun</label>
    </div>
  </div>
  <div class="ruled builds-grid">
    {%- for project in builds %}
    {%- capture num %}{% if forloop.index < 10 %}0{% endif %}{{ forloop.index }}{% endcapture %}
    <a class="build" href="{{ project.url | relative_url }}" data-category="{{ project.category }}">
      {%- if project.img and project.img != "" %}
      <div class="build-img"><img src="{{ project.img | prepend: '/' | replace: '//', '/' | relative_url }}" alt="{{ project.title }}" loading="lazy"></div>
      {%- else %}
      <div class="build-img empty"><span aria-hidden="true">{{ num }}</span></div>
      {%- endif %}
      <div class="build-body">
        <div class="build-meta"><span>{{ project.date_range }}</span><span>B-{{ num }}</span></div>
        <div class="build-title">{{ project.title }}</div>
        <p>{{ project.description }}</p>
        {%- if project.award %}
        <div class="award"><span aria-hidden="true">★</span><span>{{ project.award }}</span></div>
        {%- endif %}
      </div>
    </a>
    {%- endfor %}
  </div>
</section>
<script>
  document.querySelectorAll('input[name="build-filter"]').forEach(function (input) {
    input.addEventListener('change', function () {
      var f = input.value;
      document.querySelectorAll('.build').forEach(function (card) {
        card.hidden = f !== 'all' && card.getAttribute('data-category') !== f;
      });
    });
  });
</script>
