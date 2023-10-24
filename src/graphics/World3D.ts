import { scene } from '../renderer';
import * as THREE from 'three';

import { Seeds } from './Seeds';

export class World3D {
  // Singleton
  private static instance: World3D | null = null;

  private scene: THREE.Scene;
  private isCreatingCells: boolean = false; // Flag to track cube creation

  private cellSize: number;
  private worldSize: number;

  private cellGeometry: THREE.BoxGeometry;
  private frameBoxSize: number;
  private frameBoxGeometry: THREE.BoxGeometry;
  private frameBoxEdgeGeometry: THREE.EdgesGeometry;
  private frameBoxEdgeLines: THREE.LineSegments;

  private cellArray: boolean[][][]; // 3D array to store cell visibility

  private constructor() {
    this.scene = scene; // from renderer.ts

    this.cellSize = 1;
    this.worldSize = 100;

    this.cellGeometry = new THREE.BoxGeometry(
      this.cellSize,
      this.cellSize,
      this.cellSize,
    );
    this.frameBoxSize = this.cellSize * this.worldSize + this.cellSize;
    this.frameBoxGeometry = new THREE.BoxGeometry(
      this.frameBoxSize,
      this.frameBoxSize,
      this.frameBoxSize,
    );
    this.frameBoxEdgeGeometry = new THREE.EdgesGeometry(this.frameBoxGeometry);
    this.frameBoxEdgeLines = new THREE.LineSegments(
      this.frameBoxEdgeGeometry,
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );

    this.frameBoxEdgeLines.position.set(0, 0, 0);
    this.scene.add(this.frameBoxEdgeLines);

    // Initialize the 3D array to store cell visibility
    this.cellArray = new Array(this.worldSize);
    for (let x = 0; x < this.worldSize; x++) {
      this.cellArray[x] = new Array(this.worldSize);
      for (let y = 0; y < this.worldSize; y++) {
        this.cellArray[x][y] = new Array(this.worldSize).fill(false);
      }
    }
    //this.cellArray = Seeds.getRandomSeed(this.cellArray, 0.05);
    this.cellArray = Seeds.getClusteredSeed(this.cellArray, 10)
  }

  public static getInstance(): World3D {
    if (!World3D.instance) {
      World3D.instance = new World3D();
    }
    return World3D.instance;
  }

  public clearWorld(): void {
    this.scene.remove.apply(scene, scene.children);
    this.scene.add(this.frameBoxEdgeLines);
    this.isCreatingCells = false; // Set the flag to stop cube creation
    this.clearCellArray();
  }

  public getWorldSize(): number {
    return this.worldSize;
  }

  public startDemo(msDelay: number, addInstantly: boolean = true): void {
    if (this.isCreatingCells) {
      // If cube creation is in progress, don't start a new one
      return;
    }

    this.isCreatingCells = true; // Set the flag to indicate cube creation is in progress;

    if (addInstantly) {
      this.addCubesInstantly();
    } else {
      this.addCubesIncrementally(msDelay, 0, 0, 0);
    }
  }

  // Setter to set cell visibility
  public setCellVisibility(x: number, y: number, z: number, visible: boolean): void {
    this.cellArray[x][y][z] = visible;
  }

  private clearCellArray(): void {
    for (let x = 0; x < this.worldSize; x++) {
      for (let y = 0; y < this.worldSize; y++) {
        for (let z = 0; z < this.worldSize; z++) {
          this.cellArray[x][y][z] = false;
        }
      }
    }
  }

  private addCubesInstantly() {
    for (let x = 0; x < this.worldSize; x++) {
      for (let y = 0; y < this.worldSize; y++) {
        for (let z = 0; z < this.worldSize; z++) {
          const isCellVisible = this.cellArray[x][y][z];

          if (isCellVisible) {
            // Calculate the distance from the center of the grid
            const distance = Math.sqrt(
              (x - this.worldSize / 2) ** 2 +
              (y - this.worldSize / 2) ** 2 +
              (z - this.worldSize / 2) ** 2
            );

            // Calculate a color based on the distance (shades of red)
            const hue = 0; // Red hue
            const saturation = 1; // Full saturation
            const lightness = 1 - (distance / (this.worldSize * 1.5)); // Adjust the lightness based on distance

            // Create the cell with the calculated color and add it to the scene
            const color = new THREE.Color();
            color.setHSL(hue, saturation, lightness);
            const cellMaterial = new THREE.MeshBasicMaterial({ color });
            const cell = new THREE.Mesh(this.cellGeometry, cellMaterial);
            cell.position.set(
              x * this.cellSize - this.worldSize / 2,
              y * this.cellSize - this.worldSize / 2,
              z * this.cellSize - this.worldSize / 2
            );
            this.scene.add(cell);
          }
        }
      }
    }

    this.isCreatingCells = false; // Cube creation is complete
  }

  private addCubesIncrementally(msDelay, x, y, z) {
    if (!this.isCreatingCells) {
      // If cube creation should be stopped, exit the function
      return;
    }

    // Determine if the cell should be visible
    const isCellVisible = this.cellArray[x][y][z];

    if (isCellVisible) {
      // Create the cell and add it to the scene
      const cell = new THREE.Mesh(this.cellGeometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
      cell.position.set(
        x * this.cellSize - this.worldSize / 2,
        y * this.cellSize - this.worldSize / 2,
        z * this.cellSize - this.worldSize / 2
      );
      this.scene.add(cell);
    }

    // Continue with the next cell
    if (x < this.worldSize - 1) {
      setTimeout(() => {
        this.addCubesIncrementally(msDelay, x + 1, y, z);
      }, msDelay);
    } else if (y < this.worldSize - 1) {
      setTimeout(() => {
        this.addCubesIncrementally(msDelay, 0, y + 1, z);
      }, msDelay);
    } else if (z < this.worldSize - 1) {
      setTimeout(() => {
        this.addCubesIncrementally(msDelay, 0, 0, z + 1);
      }, msDelay);
    } else {
      // Cube creation is complete
      this.isCreatingCells = false;
    }
  }
}