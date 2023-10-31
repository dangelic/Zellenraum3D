import * as THREE from 'three';
import { Seeds } from './graphics/Seeds';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 120); // Adjust the camera position

// Set camera to look at the center of the scene
camera.lookAt(0, 0, 0);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a light source
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

let worldSize = 40;
let cellOffset = 1
const cellSize = 0.2

// Create a frameBox outside of the addCubesInstantly function
let frameBoxSize = worldSize * (cellSize  + cellOffset) - cellSize;
let frameBoxGeometry = new THREE.BoxGeometry(frameBoxSize, frameBoxSize, frameBoxSize);
let frameBoxEdgeGeometry = new THREE.EdgesGeometry(frameBoxGeometry);
let frameBoxEdgeLines = new THREE.LineSegments(
  frameBoxEdgeGeometry,
  new THREE.LineBasicMaterial({ color: 0x00ffff })
);

frameBoxEdgeLines.position.set(0, 0, 0);
scene.add(frameBoxEdgeLines);

// Render the scene
const animate = () => {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.01;
    renderer.render(scene, camera);
};

const setArray = () => {
    let cellArray = new Array(worldSize);
    for (let x = 0; x < worldSize; x++) {
        cellArray[x] = new Array(worldSize);
        for (let y = 0; y < worldSize; y++) {
            cellArray[x][y] = new Array(worldSize).fill(false);
        }
    }
    return cellArray;
}

const addCubesInstantly = (numSeed) => {
    // Clear the scene
    scene.clear();

    // Re-add the frameBox
    scene.add(frameBoxEdgeLines);

    // Create a new InstancedMesh
    const cellSize = 0.2
    const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const instanceCount = 64000;
    const mesh = new THREE.InstancedMesh(geometry, material, instanceCount);
    scene.add(mesh);

    // Create a new cell array and populate it with the seed
    let cellArray = setArray();
    cellArray = Seeds.getClusteredSeed(cellArray, numSeed);

    for (let x = 0; x < worldSize; x++) {
        for (let y = 0; y < worldSize; y++) {
            for (let z = 0; z < worldSize; z++) {
                let isCellVisible = cellArray[x][y][z];

                const matrix = new THREE.Matrix4();
                if (isCellVisible) {
                    // Adjust the cube positions based on worldSize
                    matrix.setPosition((x - worldSize / 2) * (cellSize + cellOffset), (y - worldSize / 2) * (cellSize + cellOffset), (z - worldSize / 2) * (cellSize + cellOffset));
                    mesh.setMatrixAt(x * worldSize * worldSize + y * worldSize + z, matrix);
                }
            }
        }
    }
}

// Initial call to addCubesInstantly
addCubesInstantly(50);
setInterval(() => {
    addCubesInstantly(Math.floor(Math.random() * 11) + 20);
    console.log("x")
}, 100);
// Start the animation loop
animate();

export { scene };
