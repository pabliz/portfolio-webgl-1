#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uImage;
uniform float uTime;

varying float vNoise;
varying vec2 vUv;

void main() {
    vec2 newUV = vUv;
    vec4 view = texture2D(uImage, newUV);
    gl_FragColor = view;
    gl_FragColor.rgb += 0.02*vec3(vNoise);
}