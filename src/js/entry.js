const stage = document.getElementById('stage')
let scene;
let camera;
let renderer



const init = () => {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x001738);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 0, 10)
  onResize()

  stage.appendChild(renderer.domElement)

  render()
}

const onResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

const render = () => {
  animate()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

const animate = () => {
  //main logic
}

window.onload = () => {
  init()
}

window.addEventListener('resize', onResize);
