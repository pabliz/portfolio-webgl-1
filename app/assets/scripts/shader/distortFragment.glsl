#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D tDiffuse;
uniform float scrollSpeed;
varying vec2 vUv;
void main(){
    vec2 newUV = vUv;
//originals
    float bottomArea = smoothstep(0.15,0.0,vUv.y);
    float topArea = smoothstep(0.925,1.0,vUv.y);

    // newUV.x += (vUv.x -0.5)*0.5*vUv.y;

     newUV.x -= sin(vUv.x -0.5)*bottomArea*scrollSpeed*0.2;
    //newUV.x += (vUv.x -0.5)*0.5*vUv.y;
    newUV.x -= sin(vUv.x)*0.5*topArea*scrollSpeed;
    gl_FragColor = texture2D( tDiffuse, newUV);
    // gl_FragColor = vec4(bottomArea, 0.0,0.0,1.0);
}