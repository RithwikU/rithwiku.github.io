---
layout: page
title: F1Tenth
description: Autonomous racing for 1/10 model cars
img: assets/img/f1tenth_car.JPG
importance: 2
category: work
---

##### January 2023 --- May 2023

<p>
&#x2605;<strong>Achieved first place in the reactive methods race using Follow The Gap</strong><br>
&#x2605;<strong>Achieved third place in the indoor map-based race</strong>
</p>


The car is equipped with a 2D LiDAR, VESC and Jetson NX as the compute platform.
### Follow The Gap
This algorithm is classified as a <u>reactive driving method</u>, as it identifies the widest gap in the upcoming path and moves in that direction. The gap is found by filtering and thresholding the LiDAR readings.
<iframe width="768" height="432" src="https://www.youtube.com/embed/Epvru2RtgFE" title="Lab 4: Follow the Gap - No Obstacles" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="768" height="432" src="https://www.youtube.com/embed/KjXDykeQQ_U" title="ESE615 | Follow the Gap - Levine Blocked | Team Hot Wheels" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## Map based racing

### Mapping
A package was used to map the track in th corridor.

### Localization
Particle filter was used to localize using just the LiDAR readings.

### Path Planning
Waypoints were chosen either by driving the car manually around the track or byhand selecting the desired race line from the generated map.

### Race line optimization
The waypoints generated, as mentioned in th above section, are optimzed to achieve the fastest time around the track. We used the <a href="https://github.com/TUMFTM/global_racetrajectory_optimization">TUM repository</a> to generate the waypoints by tuning the parameters for this specific car and track.

### Pure Pursuit
The control algorithm used to track the waypoints was a proportional controller using Pure Pursuit.

<iframe width="768" height="432" src="https://www.youtube.com/embed/-VfobyRqcDU" title="Pure Pursuit - Lab 5 Car | ESE615 | Team Hot Wheels" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="768" height="432" src="https://www.youtube.com/embed/QOFJfAe6v60" title="Pure Pursuit - Lab 5 RViz | ESE615| Team Hot Wheels" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="768" height="432" src="https://www.youtube.com/embed/vXvBLYYop7Q" title="Pure Pursuit - Lab 5 simulation" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>