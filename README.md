# SGI 2023/2024

## Group T02G07
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Daniel Rodrigues         | 202006562 | up202006562@up.pt |
| Tomás Maciel         | 202006845 | up202006845@up.pt |

----

## Projects

### [TP1 - ThreeJS Basics](tp1)

![Example Image](docs/images/scene_photo_1.png)
Figure 1: Scene

![Example Image](docs/images/scene_photo_2.png)
Figure 2: Scene

#### Description

The [scene](tp1/MyContents.js) aims to mimic a living room where objects are centered around two tables: the dining table and the coffee table. It has some cameras so that we can see it from various perspectives. To achieve this, we have developed the following objects:

- A [table](tp1/objects/MyTable.js) where the following objects are placed:
  - 4 [glass cups](tp1/objects/MyCup.js)
  - A [bowl](tp1/objects/MyBowl.js) with oranges
  - A [dish](tp1/objects/MyDish.js) where our delicious [chocolate cake](tp1/objects/MyCake.js) with [candles](tp1/objects/MyCandle.js) is placed
  - A [jar](tp1/objects/MyJar.js) with a [flower](tp1/objects/MyFlower.js)
  - The latest [journal](tp1/objects/MyJournal.js)

- Around the table, we have a [chair](tp1/objects/MyChair.js) and a [lamp](tp1/objects/MyLamp.js).
- Some [frames](tp1/objects/MyFrame.js) on the wall.
- A [window](tp1/objects/MyWindow.js) that reveals a beautiful landscape.
- A [door](tp1/objects/MyDoor.js) that leads to the outside.
- A [sofa](tp1/objects/MySofa.js) and an [armchair](tp1/objects/MySofa.js) where you can sit and watch the [television](tp1/objects/MyTelevision.js) or read a [book](tp1/objects/MyBook.js).
- A [rug](tp1/objects/MyRug.js) to make the room cozier.
- A [coffee table](tp1/objects/MyCoffeeTable.js).
- A [sideboard](tp1/objects/MySideboard.js) where we have a [remote control](tp1/objects/MyRemote.js) to control the [TV box](tp1/objects/MyCableBox.js) and a [spring](tp1/objects/MySpring.js).
- To brighten up the room, we have several [LED lamps](tp1/objects/MyLed.js) on the ceiling.


#### Important aspects of the developed code

- The dimensions of objects can be tailored by adjusting the parameters in their constructors.
- The size of each object is taken into account when calculating its position in the scene, so the position values are not hard-coded, i.e. you can change the size of the object and it will still be in the same relative position. For instance, the cake will remain on the table if you change its size without having to update the position settings.
- The hierarchy of objects and their corresponding meshes have been built with care.

#### Issues

- Using Bezier curves to make a quarter circle

-----

### [TP2 - Graph Scene](tp2)

![Alt text](docs/images/tp2_1.png)
![Alt text](docs/images/tp2_2.png)
![Alt text](docs/images/tp2_3.png)

#### Description

The scene developed in YASF mimics a tennis court. It includes two chairs for the players and one larger chair for the referee, four seating stands, a tennis net, a tennis ball, etc.
The work meets all the requirements of the project:
- LODs: the chairs for the players have three levels of detail and so the seating stands.
- Skybox: the scene has a skybox with the texture of a sky.
- Mipmapping: the textures of the ATP logo have mipmaps.
- Bump mapping: the texture of the tennis ball and the court field have bump mapping.
- Video texture: there is a giant screen that shows a video ad of the ATP.
- Wireframe: the user can change the polygonal mode (default, fill, wireframe) in the interface 2D.
- Buffer Geometry: at one level of detail, the seating stands are made with Buffer Geometry.
- Interface 2D: Besides the polygonal mode, the user can also change the camera, the light, and the shadow mode and reset the scene.

#### Important aspects of the developed code
An iterative depth-first search (DFS) was implemented to traverse the scene graph, providing more efficiency compared to the recursive DFS approach. The creation process of the scene graph was divided into two phases:

Firstly, establishing the scene graph with solely meshes and transformations.
Subsequently, incorporating material and other attributes inherited.

This approach allows for the utilization of cloning in nodes that share the same meshes but differ in their assigned materials.

#### Issues

Converting a recursive DFS to an iterative DFS.

----

### [TP3 - ...](tp3)

#### Description

For this project, we developed a F1 based racing game.

On this game, we have:

- 2 circuits: one focusing on design, the other more to analyze race mechanics.
- 3 parking lots to choose cars and obstacles
- A controllable by the player car
- An automatic movement car
- Powerups and obstacles to give more animation

#### Important aspects of the developed code
We implemented states for each phase of the game, which is a dynamic way to deal with the different game phases. Also we used key-frame not just for the autonomous car animation, but to create a little animation when an obstacle in put on the track middle game.

#### Issues

- Creating the OBB for collision detection.
- Shaders (mainly the second one).

