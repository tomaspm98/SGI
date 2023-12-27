import * as THREE from 'three';

class MyText3D {
    constructor(spriteSheetPath, spriteSheetWidth, spriteSheetHeight, charWidth, charHeight) {
        this.spriteSheetTexture = new THREE.TextureLoader().load(spriteSheetPath);
        this.numCharsWidth = spriteSheetWidth / charWidth;
        this.numCharsHeight = spriteSheetHeight / charHeight;
        this.charSizeU = 1 / this.numCharsWidth;
        this.charSizeV = 1 / this.numCharsHeight;
        this.spriteSheetTexture.repeat.set(this.charSizeU, this.charSizeV);
    }

    _getUV(character) {
        let charPosition = character.charCodeAt(0) - 32;
        console.log(charPosition);

        let row = Math.floor(charPosition / this.numCharsWidth);
        let column = charPosition % this.numCharsWidth;

        console.log(row, column);

        const u = column * this.charSizeU;
        const v = (this.numCharsWidth - row - 1 ) * this.charSizeV;
        return [u, v];
    }

    transformChar(character) {
        const [u, v] = this._getUV(character);
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({ map: this.spriteSheetTexture, transparent: true });
        const mesh = new THREE.Mesh(geometry, material);
        console.log(u, v);
        mesh.material.map.offset.set(u, v);
        return mesh;
    }
}

export { MyText3D };
