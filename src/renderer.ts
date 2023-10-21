import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Calculate a suitable camera position relative to cube size
const cubeSize = 1;
const gridSize = 70;
const rotationSpeedFactor = 1 / cubeSize;

const cameraDistance = cubeSize * gridSize;
camera.position.set(cameraDistance, cameraDistance, cameraDistance);  // Position the camera
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

// Create materials for cubes
const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

// Create cube geometry
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

// Create and position cubes
for (let x = 0; x < gridSize; x++) {
  grid[x] = new Array(gridSize);

  for (let y = 0; y < gridSize; y++) {
    grid[x][y] = new Array(gridSize);

    for (let z = 0; z < gridSize; z++) {
      const cubeMaterial = (x + y + z) % 2 === 0 ? blackMaterial : blueMaterial;

      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(x * cubeSize - centerX, y * cubeSize - centerY, z * cubeSize - centerZ);
      grid[x][y][z] = cube;
      scene.add(cube);
    }
  }
}

// Create an outer container cube
const outerGeometry = new THREE.BoxGeometry(cubeSize * gridSize, cubeSize * gridSize, cubeSize * gridSize);
const edgesGeometry = new THREE.EdgesGeometry(outerGeometry);
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const edges = new THREE.LineSegments(edgesGeometry, material);
edges.position.set(0, 0, 0);
scene.add(edges);

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate the entire grid around the Y-axis
  // scene.rotation.y += 0.1 * rotationSpeedFactor;

  renderer.render(scene, camera);
};

animate();