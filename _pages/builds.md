---
layout: default
title: Builds
permalink: /builds/
description: Robots, racers and side projects by Rithwik Udayagiri.
sections:
  - key: work
    title: Work
    label: Professional
  - key: fun
    title: Fun
    label: Hobby
---
{%- assign num_index = 0 -%}
<section class="section">
  <div class="builds-head">
    <h6 class="eyebrow">Build archive · {{ site.projects.size }} entries</h6>
    <h1 class="display">Builds</h1>
  </div>
  {%- for section in page.sections %}
  {%- assign builds = site.projects | where: "category", section.key | sort: "importance" %}
  <div class="builds-section">
    <div class="builds-section-head">
      <h2>{{ section.title }}</h2>
      <span class="meta">{{ section.label }} · {{ builds.size }}</span>
    </div>
    <div class="ruled builds-grid">
      {%- for project in builds %}
      {%- assign num_index = num_index | plus: 1 %}
      {%- capture num %}{% if num_index < 10 %}0{% endif %}{{ num_index }}{% endcapture %}
      <a class="build" href="{{ project.url | relative_url }}">
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
  </div>
  {%- endfor %}
</section>
