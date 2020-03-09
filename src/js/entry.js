import Shader from './modules/shaders'

console.log(Shader.fragment)


const stage = document.getElementById('stage')
let scene;
let camera;
let renderer

let stars;

const starsAmount = 300;
const starsVelo = []
const collisionPoints = []





const init = () => {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000F1C);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 0, 5)
  onResize()

  stage.appendChild(renderer.domElement)

  initStars();
  render();
}

const onResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

const initStars = () => {
  var amount = 300

  var positions = new Float32Array(amount * 3);
  var pOpacities = new Float32Array(amount * 3);
  var pSizes = new Float32Array(amount * 3);
  var pColors = new Float32Array(amount * 3);


  var vertex = new THREE.Vector3();

  for (var i = 0; i < amount; i++) {

    vertex.x = (Math.random() * 2 - 1);
    vertex.y = (Math.random() * 2 - 1);
    vertex.z = (Math.random() * 2 - 1);
    vertex.toArray(positions, i * 3);


  }

  console.log(positions)


  // const positions = new Float32Array(starsAmount * 3)

  // var vertex = new THREE.Vector3();
  // for (var i = 0; i < starsAmount; i++) {

  //   vertex.x = (Math.random() * 2.0 - 1.0);
  //   vertex.y = (Math.random() * 2.0 - 1.0);
  //   vertex.z = 0.0;
  //   vertex.toArray(positions, i * 3);


  //   if (i == 20) {
  //     
  //   }

  //   if (i < starsAmount * 2 / 3) {
  //     const rn = Math.random() * 0.001 - 0.0005
  //     starsVelo[i] = rn
  //   }
  // }


  const geo = new THREE.BufferGeometry()

  geo.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.addAttribute('pOpacity', new THREE.BufferAttribute(pOpacities, 1));
  geo.addAttribute('pSize', new THREE.BufferAttribute(pSizes, 1));
  geo.addAttribute('pColor', new THREE.BufferAttribute(pColors, 1));



  const mat = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        type: "f",
        value: 0.0
      },
      resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      }
    },
    vertexShader: Shader.vertex,
    fragmentShader: Shader.fragment,
    depthWrite: false,
    transparent: true,
    alphaTest: 0.5,
  });

  stars = new THREE.Points(geo, mat);
  console.log(stars)
  scene.add(stars)

  const opaArr = stars.geometry.attributes.pOpacity.array
  opaArr.forEach(opa => {
    opa = 1.0
  })


  render()
}

const render = () => {
  animate()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

const changeStarsPos = () => {
  const posArr = stars.geometry.attributes.position.array
  const opaArr = stars.geometry.attributes.pOpacity.array

  for (let i = 0; i < posArr.length; i++) {
    //position
    if (1 < posArr[i * 3] && 0 < starsVelo[i * 3]) {
      starsVelo[i * 3] = Math.random() * -0.001
    }
    if (posArr[i * 3] < -1 && starsVelo[i * 3] < 0) {
      starsVelo[i * 3] = Math.random() * 0.001
    }
    if (1 < posArr[i * 3 + 1] && 0 < starsVelo[i * 3 + 1]) {
      starsVelo[i * 3 + 1] = Math.random() * -0.001
    }
    if (posArr[i * 3 + 1] < -1 && starsVelo[i * 3 + 1] < 0) {
      starsVelo[i * 3 + 1] = Math.random() * 0.001
    }
    // posArr[i * 3] += starsVelo[i * 3];
    // posArr[i * 3 + 1] += starsVelo[i * 3 + 1];

    //opacity
    if (Math.random() < 0.1) {
      opaArr[i] -= 0.4
    }
    if (opaArr[i] < 0.3) {
      opaArr[i] = 1.0
    }
  }


  stars.geometry.attributes.position.needsUpdate = true;
  stars.geometry.attributes.pOpacity.needsUpdate = true;
}

const animate = () => {
  changeStarsPos()
}

window.onload = () => {
  init()
}

window.addEventListener('resize', onResize);
