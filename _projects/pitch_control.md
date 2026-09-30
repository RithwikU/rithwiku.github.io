---
layout: page
title: "Pitch Control for Airborne Ground Vehicles"
description: "Spinning the wheels mid-air to land a jumping F1TENTH car at the right angle"
img: assets/img/pitch_control_car.jpg
importance: 3
category: work
date_range: "Apr – May 2023"
---

<a href="{{ '/assets/pdf/ESE_615_Final_Project_Report.pdf' | relative_url }}">Report</a> · <a href="https://github.com/RithwikU/f1tenth_pitch_control">Github</a>

Most autonomous racing stacks plan in a 2D bird's-eye view and ignore the vertical axis. Off-road racing doesn't have that luxury: when a car goes airborne off a jump, the angle it lands at decides whether it keeps racing or tumbles. This ESE 615 final project, with Manasa Sathyan, Mengti Sun and Nicholas Gurnard, controls the pitch of an F1TENTH car mid-air by spinning its wheels, so it lands at the angle of the ramp it's heading for.

<figure>
  <img src="{{ '/assets/img/pitch_control_sketch.png' | relative_url }}" alt="Sketch of the car leaving a takeoff ramp, pitching in the air, and landing on an angled ramp">
  <figcaption>The problem: leave the takeoff ramp at θ<sub>takeoff</sub>, land at θ<sub>land</sub>.</figcaption>
</figure>

### How it works
Once the wheels leave the ground there's no contact force to steer with, but angular momentum is conserved. Speeding the wheels up pitches the body one way; slowing or reversing them pitches it the other. Modelling the wheels and axles as solid cylinders and the body as a cuboid gives the body's pitch rate as a function of wheel speed.

A PID controller tracks the error between the IMU pitch and the landing ramp's angle, and commands wheel speed to close it. There was no accurate dynamics model of the airborne car, so we first built a simulator using measured masses and dimensions of the real car to tune the controller, then carried the gains over to hardware. A UKF was tried for state estimation but dropped: raw IMU pitch from the VESC was good enough for a feedback controller and cheaper to run.

<div class="row">
  <figure>
    <img src="{{ '/assets/img/pitch_control_sim_trajectory.png' | relative_url }}" alt="Simulated trajectories with and without pitch control">
    <figcaption>Simulated flight off a 22° ramp at 6.5 m/s. Red: no control. Blue: PID pitch control.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/pitch_control_sim_plots.png' | relative_url }}" alt="Simulated pitch angle, velocity and pitch error over time">
    <figcaption>In simulation the pitch converges to the target with error on the order of 0.01 rad.</figcaption>
  </figure>
</div>

### Hardware
We first hung the car from a wire at its center of mass to confirm the effect: full throttle forward pitched the nose up, reverse pitched it down. For the jumps, the LiDAR came off and a plastic shell went on to protect the Jetson. A joystick button triggered an autonomous ramp-up to the 6.5 m/s takeoff speed, and pitch control ran from takeoff until landing.

<div class="row">
  <figure>
    <img src="{{ '/assets/img/pitch_control_tethered.jpg' | relative_url }}" alt="F1TENTH car suspended by a wire for tethered pitch tests">
    <figcaption>Tethered pitch test.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/pitch_control_car.jpg' | relative_url }}" alt="F1TENTH car with a protective plastic body">
    <figcaption>The car with its protective body.</figcaption>
  </figure>
</div>

<figure>
  <img src="{{ '/assets/img/pitch_control_indoor_setup.jpg' | relative_url }}" alt="Indoor test setup with acrylic takeoff and landing ramps and inflatable crash padding">
  <figcaption>Indoor setup: a 22° acrylic takeoff ramp, an angled landing ramp, and duct-tube padding.</figcaption>
</figure>

### Results
With no pitch control the car landed nose-down every time and often tumbled: it's all-wheel drive, so the rear wheels keep pushing up the ramp after the front ones leave it. With pitch control on a flat crash pad (target 0°) it landed near level, overshooting by about 0.26 rad because the motors are slow to respond.

<video controls playsinline preload="metadata" src="{{ '/assets/videos/2_PitchControl_CrashPad.MOV' | relative_url }}"></video>
<p class="caption">Pitch control onto the crash pad.</p>

On the real landing ramp (−20°, 2.34 m from takeoff), the pitch error converged to 0.047 rad at touchdown. Across runs the car hit the target landing angle about 85% of the time; most misses came from operator timing or motor lag.

<video controls playsinline preload="metadata" src="{{ '/assets/videos/3_PitchControl_LandingRamp.MOV' | relative_url }}"></video>
<p class="caption">Pitch control onto the landing ramp.</p>

<figure>
  <img src="{{ '/assets/img/pitch_control_ramp_plots.png' | relative_url }}" alt="Measured pitch error, velocity and motor speed during a landing-ramp jump">
  <figcaption>Measured pitch error, velocity and motor speed during a landing-ramp jump.</figcaption>
</figure>

### What's next
A proper dynamics model would open the door to MPC or LQR, and a 3D map would let the car decide when a jump is worth taking and what angle to land at. Faster motors would give the controller much more authority in the short time the car is in the air.
