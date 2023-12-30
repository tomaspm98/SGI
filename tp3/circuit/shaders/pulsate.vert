varying vec2 vUv;
uniform float timeFactor;

void main() {
        vUv = uv;
        vec3 pos = position;
        pos.x *= 1.0 + 0.2 * sin(timeFactor);
        pos.y *= 1.0 + 0.2 * sin(timeFactor);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }