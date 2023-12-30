varying vec2 vUv;
uniform sampler2D uSampler;

void main() {
    vec3 color = vec3(float(0x7A) / 255.0, float(0x7F) / 255.0, float(0x80) / 255.0);

    gl_FragColor = vec4(color, 1.0);
}