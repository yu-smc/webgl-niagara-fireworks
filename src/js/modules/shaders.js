export default {
  vertex: `
    attribute float pOpacity;
    attribute float pSize;
    attribute float pColor;
    
    varying float vOpacity;
    varying float vColor;
    
    void main() {
      vOpacity = pOpacity;
      vColor = pColor;
    
      gl_PointSize = 5.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragment: `
    precision mediump float;

    varying float vOpacity;
    varying float vColor;
    
    void main() {
    
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `
}