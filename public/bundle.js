/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/entry.js":
/*!*************************!*\
  !*** ./src/js/entry.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_shaders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/shaders */ \"./src/js/modules/shaders.js\");\n/* harmony import */ var _modules_calc_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/calc-utils */ \"./src/js/modules/calc-utils.js\");\n\n\nconsole.log(_modules_shaders__WEBPACK_IMPORTED_MODULE_0__[\"default\"].fragment);\nvar stage = document.getElementById('stage');\nvar scene;\nvar camera;\nvar renderer;\nvar stars;\nvar starsAmount = 5000;\nvar timers = [];\nvar veloYs = [];\nvar btn = document.getElementById(\"btn-launch\");\nvar renderStartTime;\nvar visibleFlags = new Float32Array(starsAmount);\nbtn.addEventListener('click', function () {\n  render();\n  renderStartTime = performance.now();\n});\n\nvar init = function init() {\n  for (var i = 0; i < starsAmount; i++) {\n    timers.push(Math.random() * (120000 - 30000) + 30000);\n    veloYs.push(Math.random() * (0.004 - 0.001) + 0.001);\n  }\n\n  scene = new THREE.Scene();\n  renderer = new THREE.WebGLRenderer();\n  renderer.setClearColor(0x000F1C);\n  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);\n  camera.position.set(0, 0, 12);\n  onResize();\n  stage.appendChild(renderer.domElement);\n  initStars();\n  renderForWaiting();\n};\n\nvar onResize = function onResize() {\n  var width = window.innerWidth;\n  var height = window.innerHeight;\n  renderer.setPixelRatio(window.devicePixelRatio);\n  renderer.setSize(width, height);\n  camera.aspect = width / height;\n  camera.updateProjectionMatrix();\n};\n\nvar initStars = function initStars() {\n  var positions = new Float32Array(starsAmount * 3);\n  var pOpacities = new Float32Array(starsAmount);\n  var pSizes = new Float32Array(starsAmount);\n  var pColors = new Float32Array(starsAmount * 3);\n  var vertex = new THREE.Vector3();\n  var color = new THREE.Color(0xffffff);\n\n  for (var i = 0; i < starsAmount; i++) {\n    if (i < starsAmount / 2) {\n      vertex.x = i / 250 - starsAmount / 2 / 250;\n      vertex.y = _modules_calc_utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getEaseOutPos(i, 3, -0.3, starsAmount / 2);\n      vertex.z = Math.random() * (0.5 - 0.45) + 0.45;\n      vertex.toArray(positions, i * 3);\n    } else {\n      vertex.x = (i - starsAmount / 2) / 250;\n      vertex.y = _modules_calc_utils__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getEaseInPos(i - starsAmount / 2, 2.7, 0.3, starsAmount / 2);\n      vertex.z = Math.random() * (0.5 - 0.45) + 0.45;\n      vertex.toArray(positions, i * 3);\n    }\n\n    var colorDiv = Math.random();\n\n    if (colorDiv < 0.33) {\n      color.setRGB(0.9, 0.7, 0);\n    } else if (0.33 <= colorDiv && colorDiv < 0.66) {\n      color.setRGB(1, 0.8, 0.6);\n    } else {\n      color.setRGB(1, 1, 0.8);\n    }\n\n    color.toArray(pColors, i * 3);\n  }\n\n  console.log(pColors);\n  var geo = new THREE.BufferGeometry();\n  geo.addAttribute('position', new THREE.BufferAttribute(positions, 3));\n  geo.addAttribute('pOpacity', new THREE.BufferAttribute(pOpacities, 1));\n  geo.addAttribute('pSize', new THREE.BufferAttribute(pSizes, 1));\n  geo.addAttribute('pColor', new THREE.BufferAttribute(pColors, 3));\n  var mat = new THREE.ShaderMaterial({\n    uniforms: {\n      time: {\n        type: \"f\",\n        value: 0.0\n      },\n      resolution: {\n        value: new THREE.Vector2(window.innerWidth, window.innerHeight)\n      }\n    },\n    vertexShader: _modules_shaders__WEBPACK_IMPORTED_MODULE_0__[\"default\"].vertex,\n    fragmentShader: _modules_shaders__WEBPACK_IMPORTED_MODULE_0__[\"default\"].fragment,\n    depthWrite: false,\n    transparent: true,\n    alphaTest: 0.5\n  });\n  stars = new THREE.Points(geo, mat);\n  console.log(stars);\n  scene.add(stars);\n  var opaArr = stars.geometry.attributes.pOpacity.array;\n  opaArr.forEach(function (opa) {\n    opa = 1.0;\n  });\n};\n\nvar renderForWaiting = function renderForWaiting() {\n  renderer.render(scene, camera);\n};\n\nvar render = function render() {\n  animate();\n  renderer.render(scene, camera);\n  requestAnimationFrame(render);\n};\n\nvar handleOpacity = function handleOpacity(opaArr, id, timePast) {\n  if (visibleFlags[id] === 0 && id < timePast / 12) {\n    //点火してる風にみせる\n    if (Math.random() < 0.996) return;\n    visibleFlags[id] = 1;\n    visibleFlags[starsAmount - id] = 1;\n  }\n\n  if (visibleFlags[id] === 0) {\n    return;\n  } else {\n    if (Math.random() < 0.1) {\n      opaArr[id] -= 0.4;\n    }\n\n    if (opaArr[id] < 0.3) {\n      opaArr[id] = 1.0;\n    }\n  }\n};\n\nvar handlePosY = function handlePosY(posArr, i, timePast) {\n  //はしっこから落とすための調整\n  var modTimer = timers[i] - Math.abs(posArr[i * 3]) * 1500;\n\n  if (modTimer <= timePast) {\n    posArr[i * 3 + 1] -= veloYs[i];\n  }\n};\n\nvar handleColor = function handleColor(colArr, i, timePast, posArr) {\n  var modTimer = timers[i] - Math.abs(posArr[i * 3]) * 1000;\n  if (modTimer <= timePast) return;\n\n  if (52000 < timePast) {\n    colArr[i * 3] -= 0.005;\n    colArr[i * 3 + 1] += 0.005;\n    colArr[i * 3 + 2] += 0.0001;\n  }\n};\n\nvar hideIfGoaled = function hideIfGoaled(posArr, opaArr, i) {\n  if (posArr[i * 3 + 1] < -1) {\n    opaArr[i] = 0;\n  }\n};\n\nvar animate = function animate() {\n  var posArr = stars.geometry.attributes.position.array;\n  var opaArr = stars.geometry.attributes.pOpacity.array;\n  var colArr = stars.geometry.attributes.pColor.array;\n  var timePast = performance.now() - renderStartTime;\n\n  for (var i = 0; i < starsAmount; i++) {\n    handleOpacity(opaArr, i, timePast);\n    handlePosY(posArr, i, timePast);\n    handleColor(colArr, i, timePast, posArr);\n    hideIfGoaled(posArr, opaArr, i);\n  }\n\n  stars.geometry.attributes.position.needsUpdate = true;\n  stars.geometry.attributes.pOpacity.needsUpdate = true;\n  stars.geometry.attributes.pColor.needsUpdate = true;\n};\n\nwindow.onload = function () {\n  init();\n};\n\nwindow.addEventListener('resize', onResize);\n\n//# sourceURL=webpack:///./src/js/entry.js?");

/***/ }),

/***/ "./src/js/modules/calc-utils.js":
/*!**************************************!*\
  !*** ./src/js/modules/calc-utils.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  getEaseOutPos: function getEaseOutPos(paticleId, startVal, changeVal, numOfParticles) {\n    paticleId /= numOfParticles;\n    paticleId--;\n    return changeVal * (Math.pow(paticleId, 3) + 1) + startVal;\n  },\n  getEaseInPos: function getEaseInPos(paticleId, startVal, changeVal, numOfParticles) {\n    paticleId /= numOfParticles;\n    return changeVal * Math.pow(paticleId, 3) + startVal;\n  }\n});\n\n//# sourceURL=webpack:///./src/js/modules/calc-utils.js?");

/***/ }),

/***/ "./src/js/modules/shaders.js":
/*!***********************************!*\
  !*** ./src/js/modules/shaders.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  vertex: \"\\n    attribute float pOpacity;\\n    attribute float pSize;\\n    attribute vec3 pColor;\\n    \\n    varying vec2 vUv;\\n    varying float vOpacity;\\n    varying vec3 vColor;\\n    \\n    void main() {\\n      vUv = uv;\\n      vOpacity = pOpacity;\\n      vColor = pColor;\\n    \\n      gl_PointSize = 45.0;\\n      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\\n    }\\n  \",\n  fragment: \"\\n    precision mediump float;\\n\\n    varying vec2 vUv;\\n    varying float vOpacity;\\n    varying vec3 vColor;\\n\\n    uniform vec2 resolution;\\n    \\n    void main() {\\n      float dist = distance(vec2(gl_PointCoord.x, gl_PointCoord.y), vec2(0.5, 0.5));\\n\\n      vec4 baseColor = vec4(vColor, (0.02 / dist - dist * 0.4) * vOpacity);\\n\\n      gl_FragColor = baseColor;\\n\\n    }\\n  \"\n});\n\n//# sourceURL=webpack:///./src/js/modules/shaders.js?");

/***/ })

/******/ });