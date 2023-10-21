import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Adjust camera position and target
camera.position.set(10, 5, 10);  // Position the camera
camera.lookAt(0, 0, 0); // Point the camera at the center of the scene

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a 3D grid and array
const gridSize = 10;
const cubeSize = 1;
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
  scene.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();