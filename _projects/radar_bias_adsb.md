---
layout: page
title: "Radar Bias Estimation using ADS-B"
description: "Measuring a radar's error against the positions aircraft broadcast about themselves"
img: assets/img/radar_bias_ppi.png
importance: 14
category: work
date_range: "May – Aug 2017"
links:
  - label: "Slides"
    url: "https://docs.google.com/presentation/d/1rhjrqrXO5Bfbovmx968eWQ6GJ-b7poy9PmDGl-mlS0k/edit?usp=sharing"
  - label: "Github"
    url: "https://github.com/RithwikU/Updated-QWT-PPI-Display"
---
Every radar has some bias: a consistent offset in the range and angle it reports, from aging components, delays and approximations. The usual way to measure it is to fly a dedicated aircraft carrying a GPS unit and compare the two. With Yashwanth, I built a tool that uses aircraft that are already flying instead.

Commercial aircraft broadcast their own GPS position over ADS-B (Automatic Dependent Surveillance–Broadcast). We received those broadcasts with an RTL-SDR radio dongle on a Raspberry Pi, treated them as the true positions, and compared them with the radar's tracks of the same aircraft.

<figure>
  <img src="{{ '/assets/img/radar_bias_ppi.png' | relative_url }}" alt="The bias estimation tool, with a circular radar display on the left and data tables on the right">
  <figcaption>The bias estimation tool, with its radar-style display (PPI) on the left.</figcaption>
</figure>

### The tool
A Qt desktop app in C++ receives ADS-B and radar data over the network, stores each in its own database, and plots both on a plan position indicator (PPI), the circular display radar operators use. You pick a radar track and the matching aircraft, and the app estimates the radar's bias in range and azimuth by linear interpolation between the two tracks.

<figure>
  <img src="{{ '/assets/img/radar_bias_architecture.png' | relative_url }}" alt="Block diagram of the app: ADS-B and radar receivers feeding databases, the PPI plot and the bias calculation">
  <figcaption>How the app fits together: separate threads receive each data source, fill the databases and update the display.</figcaption>
</figure>

### Results
In one run using 160 samples of a matched track, the tool estimated a range bias of about 134 m and an azimuth bias of about −1.08°.

<div class="photo-row">
<figure style="flex-grow: 0.87">
  <img src="{{ '/assets/img/radar_bias_tracks.png' | relative_url }}" alt="Radar and ADS-B tracks plotted together, with the matched track highlighted">
  <figcaption>Radar and ADS-B tracks plotted together.</figcaption>
</figure>
<figure style="flex-grow: 3.44">
  <img src="{{ '/assets/img/radar_bias_results.png' | relative_url }}" alt="The app's bias calculation panel showing range, azimuth and altitude bias">
  <figcaption>The bias calculation panel in the app.</figcaption>
</figure>
</div>

Next steps we identified: try other ways of computing bias, pick the matching tracks automatically, plot the errors over time, and correct for errors in the ADS-B data itself.
