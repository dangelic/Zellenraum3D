import * as THREE from 'three';


// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 64000);
camera.position.z = 50;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube geometry
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

// Material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create an InstancedMesh
const instanceCount = 64000; // Number of instances
const mesh = new THREE.InstancedMesh(geometry, material, instanceCount);

// Define the dimensions of the grid (a, b, c)
const a = 40;
const b = 40;
const c = 40;

// Populate instance matrix
const matrix = new THREE.Matrix4();
for (let i = 0; i < a; i++) {
    for (let j = 0; j < b; j++) {
        for (let k = 0; k < c; k++) {
            matrix.setPosition(i - a / 2, j - b / 2, k - c / 2);
            mesh.setMatrixAt(i * b * c + j * c + k, matrix);
        }
    }
}

// Add the mesh to the scene
scene.add(mesh);

// Create a light source
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Add event listeners to control the camera if needed

// Render the scene
const animate = () => {
    requestAnimationFrame(animate);
    scene.rotation.x += 0.01;
    // You can add animations or interactions here if needed

    renderer.render(scene, camera);
};

animate();


export {scene}