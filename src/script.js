import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as phis_movment from './phis_movment.js';
import * as phis_rotation from './phis_rotation.js';
import * as phis_auto from './phis_auto.js';
import * as init from './init.js';

let isPaused = false;
function pauseGame() {
  isPaused = true;
  continueButton.style.display = "block";
  startScreen.style.display = "flex";
}
function continueGame() {
  isPaused = false;
  continueButton.style.display = "none";
  startScreen.style.display = "none";
}
function handleKeyDown(event) {
  if (event.key === "Escape") {
    if (isPaused) {
      continueGame();
    } else {
      pauseGame();
    }
  }
}
document.addEventListener("keydown", handleKeyDown);
continueButton.textContent = "Continue";
continueButton.style.display = "none";
continueButton.addEventListener("click", continueGame);
startButton.addEventListener("click", startGame);
exitButton.addEventListener("click", () => {
  window.close();
});
function startGame() {
  startScreen.style.display = "none";
  startButton.style.display = "none";
  animate();
}

// let container, stats;
// let camera, scene, renderer;
// let controls, water, sun, mesh;
// let pale1, pale2, crops, startTime;
export let helicopter = new THREE.Group();

export var env = {
  'container':null, 'stats':null,
 'camera':null, 'scene':null, 'renderer':null,
 'controls':null, 'water':null, 'sun':null, 'mesh':null,
 'pale1':null, 'pale2':null, 'crops':null,
 'startTime':null
}
export var helicopterVar = {
  'l_x': 10.0,
  'l_z': 8.0,
  'l_y': 3.0,
  'a_xz': 25.0,
  'a_yz': 30.0,
  'a_xy': 10.0,
  'mass': 520.2,
  'lift': 0.0,
  'd_main': 1.5,
  'd_tail': 9.0,
  'inertia': 500,
  'tailRaduis': 0.8,
  'autoPiolet': false,
  'autoBalance': true,
  'bladeRadius': 7.62,
  'tailNumber': 3,
  'bladeNumber': 5,
  'mainBladeArea': 2.5,
  'tailBladeArea': 0.5,
  'ForceAutoBalance': true,
  'lift_coefficient': 0.3,
  'mainAngularVelocity': 0.0,
  'tailAngularVelocity': 0.0,
};

export var conditions = {
  'Fr_y': 0.0,
  'Fr_z': 0.0,
  'Fr_x': 0.0,
  'Fr_y_rotation': 0.0,
  'Fr_z_rotation': 0.0,
  'Fr_x_rotation': 0.0,
  'gravity': 9.8,
  'density': 1.225,
  'air_froce_constant': 0.5
};

export var info = {
  'weight': null,
  'lift': null,
  // 'rotation_x': null,
  // 'rotation_y': null,
  // 'rotation_z': null,
};
export var variables = {
  v_y1: 0.0, v_z1: 0.0, v_x1: 0.0,
  v_y2: 0.0, v_z2: 0.0, v_x2: 0.0,
  phi_x: 0.0, phi_z: 0.0, phi_y: 0.0,
  omega_x1: 0.0, omega_z1: 0.0, omega_y1: 0,
  omega_x2: 0.0, omega_z2: 0.0, omega_y2: 0,
  current_x_rotation: 0.0,
  current_z_rotation: 0.0,
  camera_y_rotation: 0.0,
};
// export var v_y1 = 0.0, v_z1 = 0.0, v_x1 = 0.0;
// export let v_y2 = 0.0, v_z2 = 0.0, v_x2 = 0.0;

// export let phi_x = 0.0;
// export let phi_z = 0.0;
// export let phi_y = 0.0;

// export let omega_x1 = 0.0, omega_z1 = 0.0, omega_y1 = 0;
// export let omega_x2 = 0.0, omega_z2 = 0.0, omega_y2 = 0;

// export var current_x_rotation = 0.0;
// export var current_z_rotation = 0.0;
// export var camera_y_rotation = 0.0;



export var keys = {};

export var listener = new THREE.AudioListener();
export var audioLoader = new THREE.AudioLoader();
export var audio = new THREE.Audio(listener);

init.init();



function updateActions() {
  if ((keys['w'] || keys['ص']) && helicopterVar['mainAngularVelocity'] <= 6) {
    helicopterVar['mainAngularVelocity'] += 0.01;
  }

  if ((keys['s'] || keys['س'])) {
    helicopterVar['mainAngularVelocity'] -= 0.01;
    if (helicopterVar['mainAngularVelocity'] < 0) {
      helicopterVar['mainAngularVelocity'] = 0;
    }
  }

  if ((keys['a'] || keys['ش'])) {
    helicopterVar['autoBalance'] = false;
    helicopterVar['tailAngularVelocity'] -= 0.3;
    if (helicopterVar['tailAngularVelocity'] < 0) {
      helicopterVar['tailAngularVelocity'] = 0;
    }
  }

  if ((keys['d'] || keys['ي'])) {
    helicopterVar['autoBalance'] = false;
    helicopterVar['tailAngularVelocity'] += 0.3;
  }

  if (keys['ArrowUp'] && helicopter.position.y > 26) {

    variables.phi_x += 0.001;
  }

  if (keys['ArrowDown'] && helicopter.position.y > 26) {

    variables.phi_x -= 0.001;
  }

  if (keys['ArrowRight'] && helicopter.position.y > 26) {
    variables.phi_z += 0.001;
  }

  if (keys['ArrowLeft'] && helicopter.position.y > 26) {
    variables.phi_z -= 0.001;
  }

}

export function onWindowResize() {
  env.camera.aspect = window.innerWidth / window.innerHeight;
  env.camera.updateProjectionMatrix();
  env.renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (isPaused) {
    audio.stop();
    return;
  }

  if (helicopterVar['mainAngularVelocity'] > 0.5)
    audio.play();
  else
    if (audio.isPlaying)
      audio.stop();


  const currentTime = Date.now();
  const deltaTime = (currentTime - env.startTime) / 1000.0;
  env.startTime = currentTime;

  updateActions();
  info['lift'].textContent = 'Lift : ' + helicopterVar['lift'].toFixed(0) + ' N'
  info['weight'].textContent = 'Weight : ' + (helicopterVar['mass'] * conditions['gravity']).toFixed(0) + ' N'
  // info['rotation_x'].textContent = 'rotation X : ' + (variables.phi_x * 180 / Math.PI).toFixed(2) + '°'
  // info['rotation_y'].textContent = 'rotation Y : ' + (variables.phi_y * 180 / Math.PI).toFixed(2) + '°'
  // info['rotation_z'].textContent = 'rotation Z : ' + (variables.phi_z * 180 / Math.PI).toFixed(2) + '°'

  if (env.pale1 != undefined && env.pale2 != undefined) {

    env.pale2.rotation.x -= Math.abs(helicopterVar['tailAngularVelocity']) <= 35.5 ? helicopterVar["tailAngularVelocity"] : 35.5;

    const angularToRotate = helicopterVar["mainAngularVelocity"];
    env.pale1.rotation.y -= angularToRotate <= 1.28 ? angularToRotate : 1.28;
    env.pale1.rotation.x = variables.phi_x > 0.23 ? 0.23 : variables.phi_x < -0.035 ? -0.035 : variables.phi_x;

    if (helicopterVar['autoPiolet']) phis_auto.autoPiolet();
    if (helicopterVar['autoBalance']) phis_auto.autoBalance();
    phis_movment.z_axis_movement(deltaTime);
    phis_movment.x_axis_movement(deltaTime);
    phis_movment.calculateLiftforce(deltaTime);


    phis_rotation.y_rotation(deltaTime);
    phis_rotation.x_rotation(deltaTime);
    phis_rotation.z_rotation(deltaTime);

    console.log("v= ",variables.v_x2,variables.v_y2,variables.v_z2)
    console.log("a= ",variables.v_x2,variables.v_y2,variables.v_z2)

  }


  const cameraDistance = 200; // Adjust the distance of the camera from the helicopter
  const cameraHeight = 80; // Adjust the height of the camera above the helicopter
  const cameraRotation = (-Math.PI / 2) - variables.camera_y_rotation; // Adjust the rotation of the camera around the helicopter
  console.log(variables.camera_y_rotation * 180 / Math.PI);
  console.log(cameraRotation * 180 / Math.PI);
  const x = helicopter.position.x + cameraDistance * Math.cos(cameraRotation);
  const y = helicopter.position.y + cameraHeight;
  const z = helicopter.position.z + cameraDistance * Math.sin(cameraRotation);
  console.log('camera',env.camera);
  env.camera.position.set(x, y, z);
  env.camera.lookAt(helicopter.position);

  render();
  env.stats.update();
}

function render() {
  const time = performance.now() * 0.001;
  env.water.material.uniforms["time"].value += 1.0 / 60.0;
  env.renderer.render(env.scene, env.camera);
}


