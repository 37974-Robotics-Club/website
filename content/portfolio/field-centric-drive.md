---
title: Field-centric driving
date: 2026-10-15
season: "2026–27"
subsystem: Programming
authors: [Jordan, Noah]
summary: We switched the drive code to use the IMU, so pushing the stick forward always moves the robot away from the driver.
---

## Goal

Make the robot easier to drive when it's turned sideways.

## How it works

The control hub's IMU tells us which way the robot is facing. We rotate the joystick input by that angle before sending power to the wheels.

```java
double heading = imu.getRobotYawPitchRollAngles().getYaw(AngleUnit.RADIANS);
double rotX = x * Math.cos(-heading) - y * Math.sin(-heading);
double rotY = x * Math.sin(-heading) + y * Math.cos(-heading);
```

## Next steps

Add a button that resets the heading in case the IMU drifts.

*Sample entry. Replace with your team's real notes.*
