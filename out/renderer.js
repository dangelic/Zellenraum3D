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
const gridSize = 50;
const rotationSpeedFactor = 1 / cubeSize;
const cameraDistance = cubeSize * gridSize * 1.5;
camera.position.set(cameraDistance, cameraDistance, cameraDistance); // Position the camera
camera.lookAt(0, 0, 0); // Point the camera at the center of the scene
// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Create a 3D grid and array
const grid = new Array(gridSize);
// Calculate the center of all inner cubes
const centerX = (gridSize - 1) * cubeSize / 2;
const centerY = (gridSize - 1) * cubeSize / 2;
const centerZ = (gridSize - 1) * cubeSize / 2;
// Create an outer container cube
const outerGeometry = new THREE.BoxGeometry(cubeSize * gridSize, cubeSize * gridSize, cubeSize * gridSize);
const edgesGeometry = new THREE.EdgesGeometry(outerGeometry);
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const edges = new THREE.LineSegments(edgesGeometry, material);
edges.position.set(0, 0, 0);
scene.add(edges);
// Create a material for the inner cubes
for (let x = 0; x < gridSize; x++) {
    grid[x] = new Array(gridSize);
    for (let y = 0; y < gridSize; y++) {
        grid[x][y] = new Array(gridSize);
        for (let z = 0; z < gridSize; z++) {
            // Create a cube for each grid cell
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            let cubeMaterial;
            // Alternate between filled and black cubes
            if ((x + y + z) % 2 === 0) {
                cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            }
            else {
                cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
            }
            grid[x][y][z] = new THREE.Mesh(geometry, cubeMaterial);
            grid[x][y][z].position.set(x * cubeSize - centerX, y * cubeSize - centerY, z * cubeSize - centerZ);
            edges.add(grid[x][y][z]);
        }
    }
}
// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    // Rotate the entire grid around the Y-axis
    scene.rotation.y += 0.1;
    renderer.render(scene, camera);
};
animate();
