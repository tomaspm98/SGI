uniform sampler2D lgrayTexture;

varying vec2 vUv;  

varying float vDisplacement;

void main() {
    vec3 normal = normalize(normalMatrix * normal);
    vec3 position = (modelMatrix * vec4(position, 1.0)).xyz;

    vUv = uv;

    float displacementAmount = texture2D(lgrayTexture, vUv).r;
    vec3 displacedPosition = position + normal * displacementAmount * 0.9; 

    gl_Position = projectionMatrix * viewMatrix * vec4(displacedPosition, 1.0);

    vDisplacement = displacementAmount;
}
