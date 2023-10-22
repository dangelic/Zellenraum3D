import * as THREE from 'three';
import { World3D } from './graphics/World3D';
import { GenerationLoop } from './graphics/GenerationLoop'; // Import the GenerationLoop class

// -- ThreeJS
// Scene
const scene = new THREE.Scene();
// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load 3D Grid-World instance as a singleton
const world3D = World3D.getInstance();

// Setup the Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const cameraDistance = world3D.getWorldSize();
camera.position.set(cameraDistance, cameraDistance, cameraDistance); // Position the camera relative to World-Size
camera.lookAt(0, 0, 0); // Point the camera at the center of the scene

// Start the demo to create the cells
// world3D.startDemo(1);

// Create an instance of GenerationLoop and start the loop
const generationLoop = new GenerationLoop(world3D.getCellArray(), 0.03, 1000); // Adjust parameters as needed
generationLoop.startLoop();

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.005; // Rotate 3D world around the Y-axis
  renderer.render(scene, camera);
};

animate();

// Apply materials to cells after the cells are created
setTimeout(() => {
  //world3D.applyMaterialsToCells();
}, 1000);

export { scene };