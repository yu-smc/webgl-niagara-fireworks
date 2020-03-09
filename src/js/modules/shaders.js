export default {
  vertex: `
    attribute float pOpacity;
    attribute float pSize;
    attribute float pColor;
    
    varying vec2 vUv;
    varying float vOpacity;
    varying float vColor;
    
    void main() {
      vUv = uv;
      vOpacity = pOpacity;
      vColor = pColor;
    
      gl_PointSize = 30.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragment: `
    precision mediump float;

    varying vec2 vUv;
    varying float vOpacity;
    // varying float vColor;

    uniform vec2 resolution;
    
    void main() {
      float dist = distance(vec2(gl_PointCoord.x, gl_PointCoord.y), vec2(0.5, 0.5));

      vec4 baseColor = vec4(1., 1., 1., (0.04 / dist - dist * 0.2) * vOpacity);

      gl_FragColor = baseColor;

    }
  `
}
