// Vertex Shader (bump.vert)

// LGray texture uniform
uniform sampler2D lgrayTexture;

// Other uniforms and attributes
varying vec2 vUv;  // Add varying variable for UV coordinates

varying float vDisplacement;

void main() {
    // Extract normal and position
    vec3 normal = normalize(normalMatrix * normal);
    vec3 position = (modelMatrix * vec4(position, 1.0)).xyz;

    // Pass UV coordinates to the fragment shader
    vUv = uv;

    // Displace the vertex based on LGray texture in camera space
    float displacementAmount = texture2D(lgrayTexture, vUv).r;
    vec3 displacedPosition = position + normal * displacementAmount * 0.2; // Adjust the factor as needed

    // Output the final position in clip space
    gl_Position = projectionMatrix * viewMatrix * vec4(displacedPosition, 1.0);

    // Pass displacement amount to the fragment shader if needed
    vDisplacement = displacementAmount;
}
