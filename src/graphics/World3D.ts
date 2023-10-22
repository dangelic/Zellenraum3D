import { scene } from '../renderer';
import * as THREE from 'three';

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
    this.addCubesIncrementally(msDelay, 0, 0, 0);
  }

  private addCubesIncrementally = (msDelay, x, y, z) => {
    if (!this.isCreatingCells) {
      // If cube creation should be stopped, exit the function
      return;
    }

    const cellMaterial =
      (x + y + z) % 2 === 0 ? this.visibleMaterial : this.hiddenMaterial;

    const cell = new THREE.Mesh(this.cellGeometry, cellMaterial);
    cell.position.set(
      x * this.cellSize - this.worldSize / 2,
      y * this.cellSize - this.worldSize / 2,
      z * this.cellSize - this.worldSize / 2,
    );
    this.scene.add(cell);

    if (x < this.worldSize) {
      setTimeout(() => {
        this.addCubesIncrementally(msDelay, x + 1, y, z);
      }, msDelay);
    } else if (y < this.worldSize) {
      setTimeout(() => {
        this.addCubesIncrementally(msDelay, 0, y + 1, z);
      }, msDelay);
    } else if (z < this.worldSize) {
      setTimeout(() => {
        this.addCubesIncrementally(msDelay, 0, 0, z + 1);
      }, msDelay);
    }
  };
}
