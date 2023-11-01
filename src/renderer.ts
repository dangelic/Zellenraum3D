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
camera.position.set(0, 3, 12);
camera.lookAt(0, 0, 0);

let worldSize = 40;
let cellOffset = 0;
const cellSize = 0.2;

const world3D = new World3D(worldSize, cellSize, cellOffset);
const emptyGeneration = world3D.getCurrentGeneration();
let currentGeneration = Seeds.getRandomSeed(emptyGeneration, 0.5);
world3D.setCurrentGeneration(currentGeneration);

let condition = true;

const intervalId = setInterval(() => {
  if (condition) {
    currentGeneration = Rules.applyClouds(currentGeneration);
    world3D.setCurrentGeneration(currentGeneration);
  } else {
    clearInterval(intervalId);
  }
}, 1000); //

// Render the scene
const animate = () => {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.005; // Rotate counter-clockwise
  renderer.render(scene, camera);
};

animate(); // Start...

export { scene };
