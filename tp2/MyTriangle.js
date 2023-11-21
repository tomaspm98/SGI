import * as THREE from 'three';
/**
 * MyTriangle
 * @constructor
 * @param x1 - x coordinate vertex 1
 * @param y1 - y coordinate vertex 1
 * @param x2 - x coordinate vertex 2
 * @param y2 - y coordinate vertex 2
 * @param x3 - x coordinate vertex 3
 * @param y3 - y coordinate vertex 3
 * @param afs - afs texture coordinate
 * @param aft - aft texture coordinate
 */
class MyTriangle extends THREE.BufferGeometry {
	constructor(xyz1, xyz2, xyz3, afs = 1, aft = 1) {
		super();	
        this.xyz1 = new THREE.Vector3(xyz1[0], xyz1[1], xyz1[2])
		this.xyz2 = new THREE.Vector3(xyz2[0], xyz2[1], xyz2[2])
		this.xyz3 = new THREE.Vector3(xyz3[0], xyz3[1], xyz3[2])
        this.initBuffers();
	}

	initBuffers() {

        //CALCULATING NORMALS 
        var vectorAx = this.xyz2.x - this.xyz1.x
		var vectorAy = this.xyz2.y - this.xyz1.y
		var vectorAz = this.xyz2.z - this.xyz1.z

		var vectorBx = this.xyz3.x - this.xyz1.x
		var vectorBy = this.xyz3.y - this.xyz1.y
		var vectorBz = this.xyz3.z - this.xyz1.z

		var crossProductX = vectorAy * vectorBz - vectorBy * vectorAz
		var crossProductY = vectorBx * vectorAz - vectorAx * vectorBz
		var crossProductZ = vectorAx * vectorBy - vectorBx * vectorAy
		
		var normal = new THREE.Vector3(crossProductX, crossProductY, crossProductZ)
        normal.normalize()

        //TEXTURE COORDINATES
		let a = this.xyz1.distanceTo(this.xyz2);
		let b = this.xyz2.distanceTo(this.xyz3);
		let c = this.xyz1.distanceTo(this.xyz3);


		let cos_ac = (a * a - b * b + c * c) / (2 * a * c)
		let sin_ac = Math.sqrt(1 - cos_ac * cos_ac)

		const vertices = new Float32Array( [
            ...this.xyz1.toArray(),	//0
			...this.xyz2.toArray(),	//1
			...this.xyz3.toArray(),	//2

        ] );
		
		const indices = [
            0, 1, 2
        ];
		
		const normals = [
			...normal.toArray(),
			...normal.toArray(),
			...normal.toArray(),
		];

/* 		const uvs = [
			0, 0,
			a , 0,
			c * cos_ac, c * sin_ac
		] */

		const uvs = [
			0, 0,
			1 , 0,
			1 * cos_ac, 1 * sin_ac
		]

        this.setIndex( indices );
        this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        this.setAttribute('uv', new THREE.Float32BufferAttribute( uvs, 2));
	}

}

export { MyTriangle };