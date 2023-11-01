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


const cameraDistance = worldSize * (cellSize ) *1.33; // 0.5 ---- offset replace me
camera.position.set(0, worldSize / 9, cameraDistance);
camera.lookAt(0, 0, 0);



const world3D = new World3D(worldSize, cellSize, cellOffset);
const emptyGeneration = world3D.getcurrentGenerationStates();
let [currentGenerationStates, isCellVisible] = Seeds.getRandomSeed(emptyGeneration, 0.5);
world3D.setCurrentGenerationStates(currentGenerationStates, isCellVisible);

let condition = true;

const intervalId = setInterval(() => {
  if (condition) {
    [currentGenerationStates, isCellVisible] = Rules.applyClouds(currentGenerationStates);
    world3D.setCurrentGenerationStates(currentGenerationStates, isCellVisible);
  } else {
    clearInterval(intervalId);
  }
}, 250); //

scene.add(world3D.cellMeshContainer)
scene.add(world3D.frameBoxContainer)

// Render the scene
const animate = () => {
  requestAnimationFrame(animate);
  world3D.cellMeshContainer.rotation.y += 0.005; // Rotate counter-clockwise
  renderer.render(scene, camera);
};

animate(); // Start...

export { scene };