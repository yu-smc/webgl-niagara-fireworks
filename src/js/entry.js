import Shader from './modules/shaders'
import Calc from './modules/calc-utils'

console.log(Shader.fragment)


const stage = document.getElementById('stage')
let scene;
let camera;
let renderer

let stars;

const starsAmount = 900;
const starsVelo = []
const collisionPoints = []

const btn = document.getElementById("btn-launch")

let renderStartTime;

const visibleFlags = new Float32Array(starsAmount)

btn.addEventListener('click', () => {
  render()
  renderStartTime = performance.now()
})





const init = () => {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000F1C);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 0, 5)
  onResize()

  stage.appendChild(renderer.domElement)

  initStars();
  renderForWaiting()
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

  var positions = new Float32Array(starsAmount * 3);
  var pOpacities = new Float32Array(starsAmount);
  var pSizes = new Float32Array(starsAmount);
  var pColors = new Float32Array(starsAmount * 3);


  var vertex = new THREE.Vector3();
  var color = new THREE.Color(0xffffff)


  for (var i = 0; i < starsAmount; i++) {

    if (i < starsAmount / 2) {
      vertex.x = (i / 100) - starsAmount / 2 / 100;
      vertex.y = Calc.getEaseOutPos(i, 1.5, -0.3, starsAmount / 2);
      vertex.z = Math.random() * (0.6 - 0.45) + (0.45)
      vertex.toArray(positions, i * 3);
    } else {
      vertex.x = (i - starsAmount / 2) / 100;
      vertex.y = Calc.getEaseInPos(i - starsAmount / 2, 1.2, 0.3, starsAmount / 2);
      vertex.z = Math.random() * (0.6 - 0.45) + (0.45)
      vertex.toArray(positions, i * 3);
    }

    if (vertex.z < 0.5) {
      console.log("a")
      color.setRGB(0.97, 0.91, 0.84)
    } else if (0.5 <= vertex.z && vertex.z < 0.55) {
      console.log("b")
      color.setRGB(1, 0.91, 0.24)
    } else {
      console.log("c")
      color.setRGB(0.9, 0, 0)
    }

    color.toArray(pColors, i * 3)

  }

  console.log(pColors)

  const geo = new THREE.BufferGeometry()

  geo.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.addAttribute('pOpacity', new THREE.BufferAttribute(pOpacities, 1));
  geo.addAttribute('pSize', new THREE.BufferAttribute(pSizes, 1));
  geo.addAttribute('pColor', new THREE.BufferAttribute(pColors, 3));

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

}

const renderForWaiting = () => {
  renderer.render(scene, camera)
}

const render = () => {
  animate()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

const handleOpacity = (opaArr, id, timePast) => {
  if (visibleFlags[id] === 0 && id < timePast / 60) {
    visibleFlags[id] = 1
    visibleFlags[starsAmount - id] = 1
  }
  if (visibleFlags[id] === 0) {
    return;
  } else {
    if (Math.random() < 0.1) {
      opaArr[id] -= 0.4
    }
    if (opaArr[id] < 0.3) {
      opaArr[id] = 1.0
    }
  }

}

const animate = () => {
  const posArr = stars.geometry.attributes.position.array
  const opaArr = stars.geometry.attributes.pOpacity.array
  const timePast = performance.now() - renderStartTime;

  for (let i = 0; i < posArr.length; i++) {




  }
  for (let i = 0; i < opaArr.length; i++) {
    //opacity


    handleOpacity(opaArr, i, timePast)

  }


  stars.geometry.attributes.position.needsUpdate = true;
  stars.geometry.attributes.pOpacity.needsUpdate = true;
}

window.onload = () => {
  init()
}

window.addEventListener('resize', onResize);