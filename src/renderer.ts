// Import necessary modules
import * as THREE from "three";
import { Seeds } from "./graphics/Seeds";
import { World3D } from "./graphics/World3D";
import { Rules } from "./rules/Rules";
import { GenerationStatesMatrix, CellVisibilityMatrix } from "./types/Types";
import { RuleBuilder } from "./rules/RuleBuilder";

// Create a WebGLRenderer for rendering the 3D scene
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a scene and a camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const worldSize = 35;
const cellOffset = 0;
const cellSize = 0.2;

// Position the camera
const cameraDistance = worldSize * cellSize * 1.42;
camera.position.set(0, worldSize / 12, cameraDistance);
camera.lookAt(0, 0, 0);

// Create a 3D world with a specific size, cell size, and cell offset
const world3D = new World3D(worldSize, cellSize, cellOffset, "random");

// Generate an initial 3D world state with some cells alive
const emptyGeneration: GenerationStatesMatrix = world3D.getCurrentGenerationStates();
let [currentGenerationStates, isCellVisible] = Seeds.getClusteredSeed(emptyGeneration, 10, 0.1);
world3D.setCurrentGenerationStates(currentGenerationStates, isCellVisible);

let condition = true;

const ruleBuilder = new RuleBuilder("445");

// Set up an interval to apply rules and animate the scene
const intervalId = setInterval(() => {
    if (condition) {
        [currentGenerationStates, isCellVisible] =
            ruleBuilder.buildRuleFromPredefinedSet(currentGenerationStates);

        world3D.setCurrentGenerationStates(currentGenerationStates, isCellVisible);
    } else {
        clearInterval(intervalId);
    }
}, 100);

// Add 3D objects to the scene
scene.add(world3D.cellMeshContainer);
scene.add(world3D.frameBoxContainer);

// Create an animation loop to render the 3D scene
const animate = () => {
    requestAnimationFrame(animate);
    world3D.cellMeshContainer.rotation.y += 0.002; // Rotate counter-clockwise
    world3D.frameBoxContainer.rotation.y += 0.002; // Rotate counter-clockwise

    renderer.render(scene, camera);
};
const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // Increase the intensity (e.g., 2)
directionalLight.position.set(1, 1, 1); // Position the light
scene.add(directionalLight);

// Add ambient light for overall scene illumination
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
animate(); // Start the animation loop

export { scene };
