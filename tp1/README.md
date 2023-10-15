# SGI - TP1

## Group T02G07
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Daniel Rodrigues         | 202006562 | up202006562@up.pt |
| Tomás Maciel         | 202006845 | up202006845@up.pt |

## Project information

TODO: Insert a photo of the scene

### Description

The [scene](MyContents.js) aims to mimic a living room where objects are centered around two tables: the dining table and the coffee table. To achieve this, we have developed the following objects:

- A [table](objects/MyTable.js) where the following objects are placed:
  - 4 [glass cups](objects/MyCup.js)
  - A [bowl](objects/MyBowl.js) with oranges
  - A [dish](objects/MyDish.js) where our delicious [chocolate cake](objects/MyCake.js) with [candles](objects/MyCandle.js) is placed
  - A [jar](objects/MyJar.js) with a [flower](objects/MyFlower.js)
  - The latest [journal](objects/MyJournal.js)

- Around the table, we have a [chair](objects/MyChair.js) and a [lamp](objects/MyLamp.js).
- Some [frames](objects/MyFrame.js) on the wall.
- A [window](objects/MyWindow.js) that reveals a beautiful landscape.
- A [door](objects/MyDoor.js) that leads to the outside.
- A [sofa](objects/MySofa.js) and an [armchair](objects/MySofa.js) where you can sit and watch the [television](objects/MyTelevision.js) or read a [book](objects/MyBook.js).
- A [rug](objects/MyRug.js) to make the room cozier.
- A [coffee table](objects/MyCoffeeTable.js).
- A [sideboard](objects/MySideboard.js) where we have a [remote control](objects/MyRemote.js) to control the [TV box](objects/MyCableBox.js) and a [spring](objects/MySpring.js).
- To brighten up the room, we have several [LED lamps](objects/MyLed.js) on the ceiling.


### Important aspects of the developed code

- The dimensions of objects can be tailored by adjusting the parameters in their constructors.
- The size of each object is taken into account when calculating its position in the scene, so the position values are not hard-coded, i.e. you can change the size of the object and it will still be in the same relative position. For instance, the cake will remain on the table if you change its size without having to update the position settings.
- The hierarchy of objects and their corresponding meshes have been built with care.

### Issues

- Using Bezier curves to make a quarter circle