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

// Calculate the total number of inner cubes
const totalInnerCubes = gridSize * gridSize * gridSize;

// Calculate the center of all inner cubes
const centerX = (gridSize - 1) * cubeSize / 2;
const centerY = (gridSize - 1) * cubeSize / 2;
const centerZ = (gridSize - 1) * cubeSize / 2;

const innerCenterX = (centerX * 2) / gridSize;
const innerCenterY = (centerY * 2) / gridSize;
const innerCenterZ = (centerZ * 2) / gridSize;

// Calculate the position of the outer box's center
const outerCenterX = 0; // Set to 0 to ensure the pivot is at the center
const outerCenterY = 0;
const outerCenterZ = 0;

// Create an outer container cube
const outerGeometry = new THREE.BoxGeometry(cubeSize * gridSize, cubeSize * gridSize, cubeSize * gridSize);

// Manually create the wireframe for the outer box
const wireframe = new THREE.WireframeGeometry(outerGeometry);
const outerMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 }); // Adjust the linewidth as needed
const outerCube = new THREE.LineSegments(wireframe, outerMaterial);
outerCube.position.set(outerCenterX, outerCenterY, outerCenterZ); // Adjust the position based on the calculated center
scene.add(outerCube);

// Create a material for the inner cubes to make them black
const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

for (let x = 0; x < gridSize; x++) {
  grid[x] = new Array(gridSize);

  for (let y = 0; y < gridSize; y++) {
    grid[x][y] = new Array(gridSize);

    for (let z = 0; z < gridSize; z++) {
      // Create a cube for each grid cell
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

      grid[x][y][z] = new THREE.Mesh(geometry, blackMaterial); // Use the black material for inner cubes
      grid[x][y][z].position.set(x * cubeSize - centerX, y * cubeSize - centerY, z * cubeSize - centerZ + 0.02); // Add a small offset
      outerCube.add(grid[x][y][z]); // Add inner cubes to the outer container
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