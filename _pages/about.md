---
layout: default
title: Profile
permalink: /
---
{%- assign p = site.data.profile -%}
<section class="hero">
  <h1 class="visually-hidden">{{ site.first_name }} {{ site.last_name }}</h1>
  <div class="filmstrip">
    {%- for photo in p.banner %}
    <figure class="filmstrip-slice">
      <img src="{{ photo.image | relative_url }}" alt="{{ photo.alt }}"{% if photo.position %} style="object-position: {{ photo.position }}"{% endif %}>
      <figcaption class="meta">{{ photo.location }}</figcaption>
    </figure>
    {%- endfor %}
  </div>
  <div class="ruled hero-strip">
    <div class="hero-name">
      <div><strong>{{ p.role }}</strong><strong>{{ p.company }}</strong><span>{{ p.location }}</span></div>
    </div>
    <p>{{ p.intro }}</p>
    <div class="hero-actions">
      <a class="btn btn-primary btn-split" href="{{ '/builds/' | relative_url }}">See my builds <span aria-hidden="true">→</span></a>
      <a class="btn btn-secondary btn-split" href="{{ '/contact/' | relative_url }}">Say hi <span aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

<section class="split section section-ruled" aria-label="About">
  <div>
    <h6 class="eyebrow">Who I am</h6>
    <div class="about-portrait"><img src="{{ p.portrait | relative_url }}" alt="{{ p.name }}"></div>
  </div>
  <div class="about-body">
    <dl class="stats">
      {%- for s in p.stats %}
      <div><dt class="meta">{{ s.key }}</dt><dd>{{ s.value }}</dd></div>
      {%- endfor %}
    </dl>
  </div>
</section>
