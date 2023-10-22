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
exports.scene = void 0;
const THREE = __importStar(require("three"));
const World3D_1 = require("./graphics/World3D");
// Scene
const scene = new THREE.Scene();
exports.scene = scene;
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const world3D = World3D_1.World3D.getInstance();
const cameraDistance = world3D.getWorldSize();
camera.position.set(cameraDistance, cameraDistance, cameraDistance); // Position the camera
camera.lookAt(0, 0, 0); // Point the camera at the center of the scene
// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
world3D.startDemo(1);
// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    // Rotate the entire grid around the Y-axis
    scene.rotation.y += 0.005;
    renderer.render(scene, camera);
};
animate();
