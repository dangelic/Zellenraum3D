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

  private hiddenMaterial: THREE.MeshBasicMaterial;
  private visibleMaterial: THREE.MeshBasicMaterial;
  private frameBoxMaterial: THREE.MeshBasicMaterial;

  private cellArray: THREE.Mesh[][][]; // 3D array to store cell information

  private constructor() {
    this.scene = scene; // from renderer.ts

    this.cellSize = 1;
    this.worldSize = 50;

    this.hiddenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.visibleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    this.frameBoxMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

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
      this.frameBoxMaterial,
    );

    this.frameBoxEdgeLines.position.set(0, 0, 0);
    this.scene.add(this.frameBoxEdgeLines);

    // Initialize the 3D array to store cell information
    this.cellArray = new Array(this.worldSize);
    for (let x = 0; x < this.worldSize; x++) {
      this.cellArray[x] = new Array(this.worldSize);
      for (let y = 0; y < this.worldSize; y++) {
        this.cellArray[x][y] = new Array(this.worldSize);
      }
    }
    this.cellArray = Seeds.getRandomSeed(this.cellArray, 0.0005);
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

  public startDemo(msDelay: number): void {
    if (this.isCreatingCells) {
      // If cube creation is in progress, don't start a new one
      return;
    }

    this.isCreatingCells = true; // Set the flag to indicate cube creation is in progress
    this.applyMaterialsToCells();
    this.addCubesInstantly();
  }

  // Getter to retrieve cell material
  public getCellMaterial(
    x: number,
    y: number,
    z: number,
  ): THREE.MeshBasicMaterial {
    return this.cellArray[x][y][z] ? this.visibleMaterial : this.hiddenMaterial;
  }

  // Setter to set cell material as visible or hidden
  public setCellMaterial(
    x: number,
    y: number,
    z: number,
    visible: boolean,
  ): void {
    this.cellArray[x][y][z] = visible;
  }

  // Clear the cell array
  private clearCellArray(): void {
    for (let x = 0; x < this.worldSize; x++) {
      for (let y = 0; y < this.worldSize; y++) {
        for (let z = 0; z < this.worldSize; z++) {
          this.cellArray[x][y][z] = false;
        }
      }
    }
  }

  private applyMaterialsToCells(): void {
    for (let x = 0; x < this.worldSize; x++) {
      for (let y = 0; y < this.worldSize; y++) {
        for (let z = 0; z < this.worldSize; z++) {
          const cellMaterial = this.getCellMaterial(x, y, z);

          // Check if the cell exists in the scene
          if (
            this.scene.children.length >
            x * this.worldSize * this.worldSize + y * this.worldSize + z + 1
          ) {
            const cell = this.scene.children[
              x * this.worldSize * this.worldSize + y * this.worldSize + z + 1
            ] as THREE.Mesh;
            cell.material = cellMaterial;
          }
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
            const cell = new THREE.Mesh(this.cellGeometry, this.visibleMaterial);
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

    // Determine if the cell should be visible or hidden
    const isCellVisible = this.cellArray[x][y][z];

    if (isCellVisible) {
      // Create the cell with the visible material and add it to the scene
      const cell = new THREE.Mesh(this.cellGeometry, this.visibleMaterial);
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
