attribute float pOpacity;
attribute float pSize;
attribute float pColor;

varying float vOpacity;
varying float vColor;

void main() {
  vOpacity = pOpacity;
  vColor = pColor

  gl_PointSize = 10.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}