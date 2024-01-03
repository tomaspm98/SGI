# TP3 - Race Game

## Description

The team created a Formula 1 web-based game.

## Important aspects of the developed code

### Circuit

The circuit is defined by a YASF file encompassing both the scenarios and the track. The track itself is represented
through a GeoJSON file, allowing for easy creation and modification using a GeoJSON editor. The game accommodates
multiple circuits by appending the name and file path to the JSON file [circuits.json](./scene/circuits.json). To
incorporate new features seamlessly, we developed a new parser specifically for the YASF file.
The track contains checkpoints, represented by cones, that are used as checkpoints. The player needs to pass through all the checkpoints to complete a lap. If the player misses a checkpoint, he can press `t` to teleport to the
last checkpoint passed.

### Power Ups and Obstacles

We've created two types of power-ups and two types of obstacles. These are represented by a
superclass, [MyActivatable.js](./circuit/MyActivatable.js), which contains shared methods and attributes. Users have the
flexibility to enhance the circuit by dragging and dropping obstacles from the obstacle park directly onto the circuit.

### Vehicle

Just like the track, the car is also represented by a YASF file, making it easy to create or modify. The game supports
multiple vehicles by adding YASF path to the JSON file [vehicles.json](./scene/vehicles.json). Each vehicle can
incorporate lights (brake, front, and reverse) that respond to the vehicle's state (braking, reversing, or
user-activated front lights). When creating a vehicle, the user assigns a specific name to the node, and the parser
interprets its function (whether it's a wheel, light, etc.). Additionally, the user can specify parameters like
acceleration, turn rate, etc. within the YASF file. To enable these functionalities, we developed a new parser for the
YASF file, allowing us to incorporate these new features seamlessly.

### Outdoor Display

To be more convenient for the user, instead of creating an outdoor display we created a HUD Display that shows the minimap,
the speed, the time, the lap and the time remaining of an obstacle or power-up.

### Picking

The [MyPicking.js](./MyPicking.js) class consolidates the picking logic. The picking is used for several
purposes, including menu navigation, vehicle selection, and the process of selecting new obstacles to be positioned
within the circuit.

### Keyframe Animation

For the movement of the autonomous car, we implemented a key-frame animation. Inside this car animation, it was necessary to have 2 animations: one for the car positions over time and another for the car rotation (when he turns). For the animation of the position, we implemented a function that computes the Euclidean distance between 2 points, and given some velocity the user chooses (difficulty), we could know how much time the car would take to move between 2 points and keep its velocity constant.
For the rotation animation, we needed to work more on it, so we started by creating a function that calculates the angle variation between 2 vectors. Then, we would access the key points of the curve, get the tangents, and calculate the angle variation between them, so that we could know how much should the car rotate.

This is implemented in the class [MyAutonomousVehicle.js](./vehicle/MyAutonomousVehicle.js).

We also used key-frame animation to create a simple animation when the user chooses an obstacle to put on the track, that is on the class [ChooseObstacle.js](./game-state/ChooseObstacle.js), on the method animation.

### Collision Detection

#### Detect if the car is inside the track

We implemented a ray cast to determine if the car was inside the track. This involves projecting a ray from the
center of the car's rear axis downwards. If the ray intersects with the track, then the car is inside the track.

#### Detect if the car is colliding with an obstacle

Our collision detection involves a two-step process:

1. **Broad-Phase:** Initially, we use the R-tree to check for potential collisions between the car and obstacles.
2. **Narrow-Phase:** Following the broad-phase check, we employ an oriented bounding box (OBB) to confirm actual
   collisions between the car and identified obstacles.

To support these checks, we introduced two new classes:

- [MyOBB.js](./collisions/MyOBB.js) for managing the oriented bounding box.
- [MyRtree.js](./collisions/MyRtree.js) for handling the R-tree structure.

Inside [MyRtree.js](./collisions/MyRtree.js), we've utilized the [rbush](https://www.npmjs.com/package/rbus) library.

### Spritesheets

We've implemented spritesheets to create 3D text. For this purpose, we've created a new
class, [MyText3D.js](./MyText3D.js) that consolidates the logic for creating 3D text.

### Shaders

We have designed 2 shaders: one to make an obstacle pulsate, and another that gives a slight relief to an image. We applied the first one to our "manual" designed object, which has a cylinder geometry to represent a pillar, that pulsates over time. The 2nd shader we ended up by using on an advertising panel, gave the car a little relief.

They are implemented on the folder shaders.

### Particles

We implemented a system of particles to simulate fireworks when the race finished and the podium was presented.
For that, we got inspired by the tutorial the teachers made available, and we made some changes to fit our requirements.
The code for that is on the class [MyFirework.js](./MyFirework.js)


### Interaction

We've developed a StateManager responsible for storing the game's current and previous states, along with the
functionality to switch between them. This implementation enables actions like reverting to the previous state,
resetting the current state, going to the main menu, etc. Additionally, we've created multiple states as
subclasses of MyClass.js, that are responsible for keeping the logic and menu/scene of each state described in the
assignment.

## Issues

- Creating the OBB for collision detection.
- Shaders (mainly the second one).

