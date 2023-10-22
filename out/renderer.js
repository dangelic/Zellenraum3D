"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = __importStar(require("three"));
// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Calculate a suitable camera position relative to cube size
const cubeSize = 1;
const gridSize = 51;
const rotationSpeedFactor = 1 / cubeSize;
const cameraDistance = cubeSize * gridSize;
camera.position.set(cameraDistance, cameraDistance, cameraDistance); // Position the camera
camera.lookAt(0, 0, 0); // Point the camera at the center of the scene
// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Create materials for cubes
const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
// Create cube geometry
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const outerCubeSize = cubeSize * gridSize + cubeSize;
// Adjust the size of the outer cube slightly larger
const outerGeometry = new THREE.BoxGeometry(outerCubeSize, outerCubeSize, outerCubeSize);
// Create edges geometry
const edgesGeometry = new THREE.EdgesGeometry(outerGeometry);
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
// Create edges object
const edges = new THREE.LineSegments(edgesGeometry, material);
// Adjust the position of the outer cube
edges.position.set(0, 0, 0);
scene.add(edges);
// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    // Rotate the entire grid around the Y-axis
    scene.rotation.y += 0.005 * rotationSpeedFactor;
    renderer.render(scene, camera);
};
// Function to add cubes incrementally
const addCubesIncrementally = (x, y, z) => {
    const cubeMaterial = (x + y + z) % 2 === 0 ? blueMaterial : blueMaterial;
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x * cubeSize - gridSize / 2, y * cubeSize - gridSize / 2, z * cubeSize - gridSize / 2);
    scene.add(cube);
    if (x < gridSize) {
        setTimeout(() => {
            addCubesIncrementally(x + 1, y, z);
        }, 1); // Adjust the delay as needed
    }
    else if (y < gridSize) {
        setTimeout(() => {
            addCubesIncrementally(0, y + 1, z);
        }, 1);
    }
    else if (z < gridSize) {
        setTimeout(() => {
            addCubesIncrementally(0, 0, z + 1);
        }, 1);
    }
};
// Call the function to start adding cubes incrementally
addCubesIncrementally(0, 0, 0);
animate();
