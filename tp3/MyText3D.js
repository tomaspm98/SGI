import * as THREE from 'three';

class MyText3D {
    /**
     * Creates an instance of MyText3D.
     * @param {string} spriteSheetPath - The path to the sprite sheet image.
     * @param {number[]} spriteSheetSize - The size of the sprite sheet [width, height].
     * @param {number[]} charSize - The size of each character in the sprite sheet [width, height].
     */
    constructor(spriteSheetPath, spriteSheetSize, charSize) {
        this.spriteSheetTexture = new THREE.TextureLoader().load(spriteSheetPath);

        const [spriteSheetWidth, spriteSheetHeight] = spriteSheetSize
        const [charWidth, charHeight] = charSize

        this.numCharsWidth = spriteSheetWidth / charWidth;
        this.numCharsHeight = spriteSheetHeight / charHeight;
        this.charSizeU = 1 / this.numCharsWidth;
        this.charSizeV = 1 / this.numCharsHeight;
        this.spriteSheetTexture.repeat.set(this.charSizeU, this.charSizeV);
    }

    /**
     * Gets the UV coordinates for a given character in the sprite sheet.
     * @param {string} character - The character for which to get UV coordinates.
     * @returns {number[]} - The UV coordinates [u, v].
     */
    _getUV(character) {
        const charPosition = character.charCodeAt(0) - 32;
        const u = (charPosition % this.numCharsWidth) * this.charSizeU;

        // the v starts from the bottom
        // so we need to get the row and subtract it from the total number of rows
        // we also need to subtract 1 because the first row is 0
        const v = (this.numCharsHeight - 1 - (Math.floor(charPosition / this.numCharsWidth))) * this.charSizeV;

        return [u, v];
    }

    /**
     * Transforms a single character into a 3D mesh.
     * @param {string} character - The character to transform.
     * @param {number[]} size - The size of the character mesh [width, height].
     * @returns {THREE.Mesh} - The 3D mesh representing the character.
     */
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

    /**
     * Transforms a string into a 3D group of characters.
     * @param {string} string - The string to transform.
     * @param {number[]} size - The size of each character mesh [width, height].
     * @returns {THREE.Group} - The 3D group containing the characters.
     */
    transformString(string, size = [1, 1]) {
        const group = new THREE.Group();

        for (let i = 0; i < string.length; i++) {
            const char = this.transformChar(string[i], [size[0], size[1]]);
            char.position.x = i * size[0] * 0.4;
            group.add(char);
        }
        return group;
    }
}

export { MyText3D };
