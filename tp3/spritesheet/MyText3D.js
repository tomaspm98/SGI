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
        const charPosition = character.charCodeAt(0) - 32;
        const u = (charPosition % this.numCharsWidth) * this.charSizeU;

        // the v starts from the bottom
        // so we need to get the row and subtract it from the total number of rows
        // we also need to subtract 1 because the first row is 0
        const v = (this.numCharsHeight - 1 - (Math.floor(charPosition / this.numCharsWidth))) * this.charSizeV;

        return [u, v];
    }

    transformChar(character, size = [1, 1]) {
        const [u, v] = this._getUV(character);
        const [width, height] = size;

        const spriteSheetClone = this.spriteSheetTexture.clone();

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ map: spriteSheetClone, transparent: true });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.material.map.offset.set(u, v);

        return mesh;
    }

    transformString(string, size = [1, 1]) {
        const group = new THREE.Group();

        const widthChar = size[0] / string.length;
        const heightChar = size[1];

        for (let i = 0; i < string.length; i++) {
            const char = this.transformChar(string[i], [widthChar, heightChar]);
            char.position.x = i * widthChar;
            group.add(char);
        }
        return group;
    }
}

export { MyText3D };
