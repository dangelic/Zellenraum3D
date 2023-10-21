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
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Create a 3D grid and array
const gridSize = 5; // Adjust the size as needed
const cubeSize = 1; // Adjust the size of each cube
const grid = new Array(gridSize);
// Calculate the center of the grid
const centerX = (gridSize - 1) * cubeSize / 2;
const centerY = (gridSize - 1) * cubeSize / 2;
const centerZ = (gridSize - 1) * cubeSize / 2;
scene.position.set(0, -centerY, 0); // Adjust the Y position to center the grid
for (let x = 0; x < gridSize; x++) {
    grid[x] = new Array(gridSize);
    for (let y = 0; y < gridSize; y++) {
        grid[x][y] = new Array(gridSize);
        for (let z = 0; z < gridSize; z++) {
            // Create a cube for each grid cell
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
            grid[x][y][z] = new THREE.Mesh(geometry, material);
            grid[x][y][z].position.set(x * cubeSize - centerX, y * cubeSize, z * cubeSize - centerZ); // Adjust the positions based on the center
            scene.add(grid[x][y][z]);
        }
    }
}
// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    // Rotate the entire grid around the Y-axis
    scene.rotation.y += 0.005;
    renderer.render(scene, camera);
};
animate();
