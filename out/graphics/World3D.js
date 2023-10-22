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
exports.World3D = void 0;
const renderer_1 = require("../renderer");
const THREE = __importStar(require("three"));
class World3D {
    constructor() {
        this.addCubesIncrementally = (msDelay, x, y, z) => {
            const cellMaterial = (x + y + z) % 2 === 0 ? this.visibleMaterial : this.hiddenMaterial;
            const cell = new THREE.Mesh(this.cellGeometry, cellMaterial);
            cell.position.set(x * this.cellSize - this.worldSize / 2, y * this.cellSize - this.worldSize / 2, z * this.cellSize - this.worldSize / 2);
            this.scene.add(cell);
            if (x < this.worldSize) {
                setTimeout(() => {
                    this.addCubesIncrementally(msDelay, x + 1, y, z);
                }, msDelay);
            }
            else if (y < this.worldSize) {
                setTimeout(() => {
                    this.addCubesIncrementally(msDelay, 0, y + 1, z);
                }, msDelay);
            }
            else if (z < this.worldSize) {
                setTimeout(() => {
                    this.addCubesIncrementally(msDelay, 0, 0, z + 1);
                }, msDelay);
            }
        };
        this.scene = renderer_1.scene; // from renderer.ts
        this.cellSize = 1;
        this.worldSize = 50;
        this.hiddenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.visibleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.frameBoxMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        this.cellGeometry = new THREE.BoxGeometry(this.cellSize, this.cellSize, this.cellSize);
        this.frameBoxSize = this.cellSize * this.worldSize + this.cellSize;
        this.frameBoxGeometry = new THREE.BoxGeometry(this.frameBoxSize, this.frameBoxSize, this.frameBoxSize);
        this.frameBoxEdgeGeometry = new THREE.EdgesGeometry(this.frameBoxGeometry);
        this.frameBoxEdgeLines = new THREE.LineSegments(this.frameBoxEdgeGeometry, this.frameBoxMaterial);
        this.frameBoxEdgeLines.position.set(0, 0, 0);
        this.scene.add(this.frameBoxEdgeLines);
    }
    static getInstance() {
        if (!World3D.instance) {
            World3D.instance = new World3D();
        }
        return World3D.instance;
    }
    getWorldSize() {
        return this.worldSize;
    }
    startDemo(msDelay) {
        this.addCubesIncrementally(msDelay, 0, 0, 0);
    }
}
exports.World3D = World3D;
// Singleton
World3D.instance = null;
