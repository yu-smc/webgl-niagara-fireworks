import Shader from './modules/shaders'
import Calc from './modules/calc-utils'
import OrbitControls from './modules/OrbitControls'


const btnSoundOn = document.getElementById("btn-launch-sound-on")
const btnSoundOff = document.getElementById("btn-launch-sound-off")
const loadingScreen = document.getElementById('loadingScreen')
const ui = document.getElementById('ui')

const starsAmount = 5000;
const status = {
  isPlaying: false
}
const stage = document.getElementById('stage')

let scene;
let camera;
let renderer
let control;
let stars;
let timers;
let veloYs;
let renderStartTime;
let visibleFlags

//sound関連の読み込みと初期化
var sound = new Howl({
  src: ['./statics/sound/Niagara.mp3'],
  loop: false
});

let isSoundLoaded = false
sound.once('load', function () {
  sound.volume(0.3)
  isSoundLoaded = true
});

const playSound = () => {
  setTimeout(() => {
    sound.play()
  }, 2000)
}

const hideUi = () => {
  ui.classList.remove('active')
}

//演出終了後の初期化
const reset = () => {

  scene.children.forEach(child => {
    child.geometry.dispose()
    child.material.dispose()
  })
  scene.children = []
  scene.dispose()
  scene = undefined
  renderer = undefined
  camera = undefined
  control = undefined
  timers = undefined
  veloYs = undefined
  renderStartTime = undefined
  visibleFlags = undefined

  ui.classList.add('active')

  init()
  status.isPlaying = false;
}


const setEndTimer = () => {
  setTimeout(
    reset, 100000)
}

const start = () => {
  status.isPlaying = true;
  render()
  setEndTimer()
  renderStartTime = performance.now()
}

//トリガー
btnSoundOn.addEventListener('click', () => {
  hideUi()
  setTimeout(() => {
    start()
    playSound()
  }, 1500)

})
btnSoundOff.addEventListener('click', () => {
  hideUi()
  setTimeout(() => {
    start()
  }, 1500)
})



const init = () => {
  visibleFlags = new Float32Array(starsAmount)

  timers = []
  veloYs = []
  for (let i = 0; i < starsAmount; i++) {
    timers.push(Math.random() * (90000 - 30000) + 30000)
    veloYs.push(Math.random() * (0.004 - 0.001) + 0.001)
  }

  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({
    alpha: true
  })
  // renderer.setClearColor(0x00192E);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 0, 14)
  onResize()

  if (stage.lastChild) {
    stage.removeChild(stage.lastChild)
  }
  stage.appendChild(renderer.domElement)

  initStars();
  initClanes();

  control = new THREE.OrbitControls(camera, renderer.domElement)
  control.autoRotate = true;
  control.autoRotateSpeed = 0.3;


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
  scene.add(stars)

  const opaArr = stars.geometry.attributes.pOpacity.array
  opaArr.forEach(opa => {
    opa = 1.0
  })
}

const initClanes = () => {
  const geo1 = new THREE.Geometry()

  geo1.vertices.push(new THREE.Vector3(10.2, 3, 0.5));
  geo1.vertices.push(new THREE.Vector3(11, -1, 0.3));
  geo1.vertices.push(new THREE.Vector3(11, -1, 0.7));
  geo1.vertices.push(new THREE.Vector3(11.3, -1, 0.5));

  geo1.faces.push(new THREE.Face3(0, 1, 2));
  geo1.faces.push(new THREE.Face3(0, 2, 3));
  geo1.faces.push(new THREE.Face3(0, 3, 1));
  geo1.faces.push(new THREE.Face3(1, 3, 2));

  const geo2 = new THREE.Geometry()

  geo2.vertices.push(new THREE.Vector3(-10.2, 3, 0.5));
  geo2.vertices.push(new THREE.Vector3(-11, -1, 0.3));
  geo2.vertices.push(new THREE.Vector3(-11, -1, 0.7));
  geo2.vertices.push(new THREE.Vector3(-11.3, -1, 0.5));

  geo2.faces.push(new THREE.Face3(0, 1, 2));
  geo2.faces.push(new THREE.Face3(0, 2, 3));
  geo2.faces.push(new THREE.Face3(0, 3, 1));
  geo2.faces.push(new THREE.Face3(1, 3, 2));

  const mat = new THREE.MeshNormalMaterial();

  const clane1 = new THREE.Mesh(geo1, mat);
  scene.add(clane1);
  const clane2 = new THREE.Mesh(geo2, mat);
  scene.add(clane2);
}


const render = () => {
  if (!status.isPlaying) return
  control.update()
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

  if (50000 < timePast) {
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
  loadingScreen.classList.remove('active')
  init()
}

window.addEventListener('resize', onResize);