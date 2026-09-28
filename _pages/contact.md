---
layout: default
title: Say hi
permalink: /contact/
full_bleed: true
description: Get in touch with Rithwik Udayagiri.
---
<section class="contact">
  <div class="contact-inner">
    <div>
      <div class="contact-kicker">// Open a channel</div>
      <h1 class="display">Let's build something weird.</h1>
    </div>
    <div class="channels">
      <a class="primary" href="mailto:{{ site.email }}"><span>{{ site.email }}</span><span aria-hidden="true">→</span></a>
      <a href="https://github.com/{{ site.github_username }}"><span>GitHub</span><span aria-hidden="true">↗</span></a>
      <a href="https://www.linkedin.com/in/{{ site.linkedin_username }}"><span>LinkedIn</span><span aria-hidden="true">↗</span></a>
      <a href="https://twitter.com/{{ site.twitter_username }}"><span>Twitter</span><span aria-hidden="true">↗</span></a>
      <a href="{{ site.data.timeline.resume | relative_url }}" target="_blank" rel="noopener"><span>Résumé (PDF)</span><span aria-hidden="true">↗</span></a>
    </div>
  </div>
</section>
