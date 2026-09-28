---
layout: default
title: Profile
permalink: /
---
{%- assign p = site.data.profile -%}
<section class="hero">
  <h1>{{ p.headline }}<span class="dot">.</span><span class="cursor" aria-hidden="true"></span></h1>
  <div class="ruled hero-strip">
    <div class="hero-name">
      <div><strong>{{ p.name }}</strong><span>{{ p.location }}</span></div>
    </div>
    <p>{{ p.intro }}</p>
    <div class="hero-actions">
      <a class="btn btn-primary btn-split" href="{{ '/builds/' | relative_url }}">See my builds <span aria-hidden="true">→</span></a>
      <a class="btn btn-secondary btn-split" href="{{ '/contact/' | relative_url }}">Say hi <span aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

<section class="split section section-ruled" aria-labelledby="about-title">
  <div>
    <h6 class="eyebrow">Operator profile</h6>
    <h2 class="display" id="about-title">About</h2>
    <div class="about-portrait grayscale"><img src="{{ p.portrait | relative_url }}" alt="{{ p.name }}"></div>
  </div>
  <div class="about-body">
    <p>{{ p.bio }}</p>
    <dl class="stats">
      {%- for s in p.stats %}
      <div><dt class="meta">{{ s.key }}</dt><dd>{{ s.value }}</dd></div>
      {%- endfor %}
    </dl>
  </div>
</section>
