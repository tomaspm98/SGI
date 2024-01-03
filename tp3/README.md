# TP3 - Race Game

## Description

The team created a Formula 1 web-based game.

## Important aspects of the developed code

### Circuit

The circuit is defined by a YASF file encompassing both the scenarios and the track. The track itself is represented
through a GeoJSON file, allowing for easy creation and modification using a GeoJSON editor. The game accommodates
multiple circuits by appending the name and file path to the JSON file [circuits.json](./scene/circuits.json). To
incorporate new features seamlessly, we developed a new parser specifically for the YASF file.
The track contains checkpoints, represented by cones, that are used as checkpoints. The player needs to pass throught
all the checkpoints in order to complete a lap. If the player misses a checkpoint, he can press `t` to teleport to the
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

To be more convinient for the user, instead creating a outdoor display we created a HUD Display that shows the minimap,
the speed, the time, the lap and the time remaining of an obstacle or power up.

### Picking

The [MyPicking.js](./MyPicking.js) class consolidates the picking logic. The picking is used for several
purposes, including menu navigation, vehicle selection, and the process of selecting new obstacles to be positioned
within the circuit.

### Keyframe Animation

### Collision Detection

#### Detect if the car is inside the track

We implemented a ray cast to determine if the car is inside the track. This involves projecting a ray from the
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

### Spitesheets

We've implemented spritesheets to create 3D text. For this purpose, we've created a new
class, [MyText3D.js](./MyText3D.js) that consolidates the logic for creating 3D text.

### Shaders

### Particles

### Interaction

We've developed a StateManager responsible for storing the game's current and previous states, along with the
functionality to switch between them. This implementation enables actions like reverting to the previous state,
resetting the current state, go to main menu, etc. Additionally, we've created multiple states as
subclasses of MyClass.js, that are responsible for keeping the logic and menu/scene of each state described in the
assignment.

## Issues

- Creating the OBB for collision detection.
- Shaders.
