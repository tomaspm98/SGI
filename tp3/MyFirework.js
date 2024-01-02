import * as THREE from 'three'


class MyFirework {

    constructor(scene, x, z) {
        this.scene = scene

        this.done = false
        this.dest = []

        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null
        this.x = x
        this.z = z

        this.material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })

        this.height = 10
        this.speed = 60

        this.launch(this.x, this.z, -2, 2)
    }

    /**
     * compute particle launch
     */

    launch(xIni, zIni, minLim, maxLim) {
        let color = new THREE.Color()
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), THREE.MathUtils.randFloat(0.1, 0.9), THREE.MathUtils.randFloat(0.1, 0.9))
        let colors = [color.r, color.g, color.b]

        this.xDest = THREE.MathUtils.randFloat(5, 15)
        this.yDest = THREE.MathUtils.randFloat(this.height * 0.8, this.height * 1.2)
        this.zDest = THREE.MathUtils.randFloat(78, 82)
        this.dest.push( this.xDest, this.yDest, this.zDest ) 
        let verticeX = xIni + (Math.random() * (maxLim - minLim) + minLim);
        let verticeY = 0
        let verticeZ = zIni + (Math.random() * (maxLim - minLim) + minLim);
        let vertices = [verticeX, verticeY, verticeZ]

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        //console.log(this.geometry)
        this.points = new THREE.Points(this.geometry, this.material)
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.scene.add(this.points)
        //console.log("firework launched")
    }

    explode(vector) {
        this.scene.remove(this.points)
        this.dest = [];
        this.geometry = new THREE.BufferGeometry();
        const numPoints = 80
        this.colors = new Float32Array(numPoints * 3);
        this.positions = new Float32Array(numPoints * 3)
        this.points = new THREE.Points(this.geometry, this.material)

        for (let i = 0; i < numPoints; i++) {
            let color = new THREE.Color();
            color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), THREE.MathUtils.randFloat(0.1, 0.9), THREE.MathUtils.randFloat(0.1, 0.9));
            this.colors[i * 3] = color.r
            this.colors[i * 3 + 1] = color.g
            this.colors[i * 3 + 2] = color.b
            let x = THREE.MathUtils.randFloat( this.xDest-5, this.xDest+5 ) 
            let y = THREE.MathUtils.randFloat( this.height * 0.7, this.height * 1.3)
            let z = THREE.MathUtils.randFloat( this.zDest-5, this.zDest+5 ) 

            this.dest.push(x, y, z);

            let from =
                [Math.fround(vector[0]), Math.fround(vector[1]), Math.fround(vector[2])];

            this.positions[i * 3] = from[0]
            this.positions[i * 3 + 1] = from[1]
            this.positions[i * 3 + 2] = from[2]
        }
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.positions), 3));
        this.scene.add(this.points);
    }

    /**
     * cleanup
     */
    reset() {
        //console.log("firework reseted")
        this.scene.remove(this.points)
        this.dest = []
        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null
    }

    /**
     * update firework
     * @returns
     */
    update() {

        // do only if objects exist
        if (this.points && this.geometry) {
            let verticesAtribute = this.geometry.getAttribute('position')
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions - moviment
            let j = 0
            for (let i = 0; i < vertices.length; i += 3) {
                vertices[i] += (this.dest[i] - vertices[i]) / this.speed
                vertices[i + 1] += (this.dest[i + 1] - vertices[i + 1]) / this.speed
                vertices[i + 2] += (this.dest[i + 2] - vertices[i + 2]) / this.speed

            }
            verticesAtribute.needsUpdate = true

            /*if (this.geometry){
                let verticesAtribute2 = this.geometry.getAttribute( 'position' )
                let vertices2 = verticesAtribute.array
                let count2 = verticesAtribute.count

                for( let i = 0; i < vertices2.length; i+=3 ) {
                    vertices2[i] += ( this.dest[i] - vertices2[i] ) /this.speed
                    vertices2[i+1] += ( this.dest[i+1] - vertices2[i+1] ) /this.speed
                    vertices2[i+2] += ( this.dest[i+2] - vertices2[i+2] ) /this.speed

                }
                verticesAtribute2.needsUpdate = true
            }*/

            // only one particle?
            if (count === 1) {
                //is YY coordinate higher close to destination YY? 
                if (Math.ceil(vertices[1]) > (this.dest[1] * 0.95)) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    //console.log(vertices)
                    this.explode(vertices)
                }
            }


            // are there a lot of particles (aka already exploded)?
            if (count > 1) {
                // fade out exploded particles
                this.material.opacity -= 0.01;
                this.material.needsUpdate = true;
            }

            // remove, reset and stop animating 
            if (this.material.opacity <= 0) {
                this.reset()
                this.done = true
                return
            }
        }

    }
}

export {MyFirework}