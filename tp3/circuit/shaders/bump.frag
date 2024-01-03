// Fragment Shader (bump.frag)

// Texture from the user
uniform sampler2D uTexture;

// UV coordinates from the vertex shader
varying vec2 vUv;

void main() {
    // Sample the texture using UV coordinates
    vec3 textureColor = texture2D(uTexture, vUv).rgb;

    // Output the final color
    gl_FragColor = vec4(textureColor, 1.0);
}
