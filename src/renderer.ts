import * as THREE from 'three';
import { Seeds } from './graphics/Seeds';
import { World3D } from './graphics/World3D';
import { Rules } from './rules/Rules';

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
let worldSize = 50;
let cellOffset = 0;
const cellSize = 0.2;

const cameraDistance = worldSize * (cellSize) * 1.33;
camera.position.set(0, worldSize / 9, cameraDistance);
camera.lookAt(0, 0, 0);

const world3D = new World3D(worldSize, cellSize, cellOffset);
let currentGeneration = Seeds.getRandomSeed(world3D.getCurrentGeneration(), 0.5);
world3D.setCurrentGeneration(currentGeneration);

let condition = true;

// Define a tick function for animation and updates
const tick = () => {
  if (condition) {
    currentGeneration = Rules.applyClouds(currentGeneration);
    world3D.setCurrentGeneration(currentGeneration);
  }
  requestAnimationFrame(tick);
  world3D.cellContainer.rotation.y += 0.05 ; // Rotate counter-clockwise
  renderer.render(scene, camera);
};

const tickFrameBox = () => {
  frameBox.rotation.y += 0.0000; // Rotate the frameBox faster
  requestAnimationFrame(tickFrameBox);
};

const frameBox = world3D.frameBoxContainer
scene.add(frameBox);

// Start the animation loop for the frameBox rotation
tickFrameBox();


// Start the animation loop using tick
tick();

export { scene };