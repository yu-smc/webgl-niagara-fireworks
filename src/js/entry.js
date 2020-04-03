import Shader from './modules/shaders'
import Calc from './modules/calc-utils'

console.log(Shader.fragment)


const stage = document.getElementById('stage')
let scene;
let camera;
let renderer

let stars;

const starsAmount = 5000;
let timers = []
let veloYs = []

const btn = document.getElementById("btn-launch")

let renderStartTime;

const visibleFlags = new Float32Array(starsAmount)

btn.addEventListener('click', () => {
  render()
  renderStartTime = performance.now()
})





const init = () => {
  for (let i = 0; i < starsAmount; i++) {
    timers.push(Math.random() * (120000 - 30000) + 30000)
    veloYs.push(Math.random() * (0.004 - 0.001) + 0.001)
  }

  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000F1C);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 0, 12)
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
      vertex.x = (i / 250) - starsAmount / 2 / 250;
      vertex.y = Calc.getEaseOutPos(i, 3, -0.3, starsAmount / 2);
      vertex.z = Math.random() * (0.5 - 0.45) + (0.45)
      vertex.toArray(positions, i * 3);
    } else {
      vertex.x = (i - starsAmount / 2) / 250;
      vertex.y = Calc.getEaseInPos(i - starsAmount / 2, 2.7, 0.3, starsAmount / 2);
      vertex.z = Math.random() * (0.5 - 0.45) + (0.45)
      vertex.toArray(positions, i * 3);
    }

    const colorDiv = Math.random()

    if (colorDiv < 0.33) {
      color.setRGB(0.9, 0.7, 0)
    } else if (0.33 <= colorDiv && colorDiv < 0.66) {
      color.setRGB(1, 0.8, 0.6)
    } else {
      color.setRGB(1, 1, 0.8)
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
  if (visibleFlags[id] === 0 && id < timePast / 12) {
    //点火してる風にみせる
    if (Math.random() < 0.996) return
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

const handlePosY = (posArr, i, timePast) => {
  //はしっこから落とすための調整
  const modTimer = timers[i] - Math.abs(posArr[i * 3]) * 1500;
  if (modTimer <= timePast) {
    posArr[i * 3 + 1] -= veloYs[i]
  }
}


const handleColor = (colArr, i, timePast, posArr) => {
  const modTimer = timers[i] - Math.abs(posArr[i * 3]) * 1000;
  if (modTimer <= timePast) return;

  if (52000 < timePast) {
    colArr[i * 3] -= 0.005
    colArr[i * 3 + 1] += 0.005
    colArr[i * 3 + 2] += 0.0001
  }

}

const hideIfGoaled = (posArr, opaArr, i) => {
  if (posArr[i * 3 + 1] < -1) {
    opaArr[i] = 0;
  }
}

const animate = () => {
  const posArr = stars.geometry.attributes.position.array
  const opaArr = stars.geometry.attributes.pOpacity.array
  const colArr = stars.geometry.attributes.pColor.array
  const timePast = performance.now() - renderStartTime;

  for (let i = 0; i < starsAmount; i++) {
    handleOpacity(opaArr, i, timePast)
    handlePosY(posArr, i, timePast)
    handleColor(colArr, i, timePast, posArr)
    hideIfGoaled(posArr, opaArr, i)
  }

  stars.geometry.attributes.position.needsUpdate = true;
  stars.geometry.attributes.pOpacity.needsUpdate = true;
  stars.geometry.attributes.pColor.needsUpdate = true;
}

window.onload = () => {
  init()
}

window.addEventListener('resize', onResize);