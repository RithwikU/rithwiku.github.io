---
layout: page
title: Indoor-Outdoor Localization
description: Localizing and navigating indoor and outdoor terrains using a Velodyne 3D LiDAR and GPS
img: assets/img/indoor_outdorr_map.png
importance: 4
category: work
---

##### April 2023 --- May 2023

This project implements algorithms for localization in environments comprising both indoor and outdoor regions
on the AgileX Scout 2.0 ground robot outfitted with a Velodyne VLP-16 LiDAR and GPS. Our work presents a factor
graph-based approach to localization. We perform sensor fusion between LiDAR and GPS data using the GTSAM library
in hybrid maps where LiDAR alone may be insufficient. A highly accurate map was collected using the 3D Graph SLAM
approach from and LiDAR localization in subsequent trials was performed using the same library. A set of waypoints were
manually placed in the map and autonomously tracked using Pure Pursuit to complete a loop through Penn Engineering
buildings. We confirmed that LiDAR localization predictably failed in the outdoor region of our map. As the outdoor region of
our test environment is surrounded by tall buildings, we were unable to obtain GPS data consistently. Thus we evaluated our
sensor fusion algorithm using a simulated dataset derived from actual map waypoints and synthetic noise. The filtering result
from the factor graph produced excellent tracking in both indoor and outdoor regions of the simulated trajectory - following
the LiDAR estimate closely in indoor regions and appropriately incorporating GPS and odometry readings in outdoor regions
where LiDAR lost localization entirely.

<a href="https://drive.google.com/file/d/1uWnWcRCzyihe1TnWvUuB8r9CrCFG9F8j/view?usp=sharing">Report</a>

<a href="https://github.com/RithwikU/Indoor-Outdoor-Localization-for-Ground-Vehicles">Github</a>

<a href="https://drive.google.com/drive/folders/1s7HtdtVTXNu0xa10nmilq5PnqHSr1L1B?usp=sharing">Media</a>



<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/indoor_outdoor_robot.JPG" title="Robot with GPS and LiDAR" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The AgileX Scout2.0 mounted with a GPS antenna and a Velodyne Puck Lite 3D LiDAR. The tean working hard all night in the background.
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/indoor_outdorr_map.png" title="Map for localization" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The 3D point cloud map with the waypoints to track.
</div>