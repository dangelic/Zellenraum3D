import * as THREE from 'three';
import { scene } from '../renderer';

export class World3D {
  private worldSize: number;
  private cellSize: number;
  private cellOffset: number;

  private currentGeneration: boolean[][][];
  private generationCount: number;

  public constructor(worldSize: number, cellSize: number, cellOffset: number) {
    this.worldSize = worldSize;
    this.cellSize = cellSize;
    this.cellOffset = cellOffset;

    this.currentGeneration = this.createEmptyGeneration();
    this.generationCount = 0;

    this.createFramebox();
  }

  // Getter & Setter
  //
  //

  public getCurrentGeneration(): boolean[][][] {
    return this.currentGeneration;
  }

  public setCurrentGeneration(currentGeneration: boolean[][][]): void {
    this.generationCount++; // Adjust the counter
    console.log('Generation Count: ' + this.generationCount);

    this.currentGeneration = currentGeneration;
    this.addCellsToScene();
  }

  private addCellsToScene = (): void => {
    // Clear scene and Re-add frameBox
    scene.clear();
    this.createFramebox();

    // Create new InstancedMesh and add it to the scene
    const geometry = new THREE.BoxGeometry(
      this.cellSize,
      this.cellSize,
      this.cellSize,
    );
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const numInstances = Math.pow(this.worldSize, 3); // cubic relation to worldSize (x*y*z cells)
    const cellMesh = new THREE.InstancedMesh(geometry, material, numInstances);
    scene.add(cellMesh);

    for (let x = 0; x < this.worldSize; x++) {
      for (let y = 0; y < this.worldSize; y++) {
        for (let z = 0; z < this.worldSize; z++) {
          let isCellVisible = this.currentGeneration[x][y][z];

          const matrix = new THREE.Matrix4();
          if (isCellVisible) {
            // Adjust cell positions based on worldSize
            matrix.setPosition(
              (x - this.worldSize / 2) * (this.cellSize + this.cellOffset),
              (y - this.worldSize / 2) * (this.cellSize + this.cellOffset),
              (z - this.worldSize / 2) * (this.cellSize + this.cellOffset),
            );
            cellMesh.setMatrixAt(
              x * this.worldSize * this.worldSize + y * this.worldSize + z,
              matrix,
            );
          }
        }
      }
    }
  };

  private createEmptyGeneration(): boolean[][][] {
    const currentGeneration = new Array(this.worldSize);
    for (let x = 0; x < this.worldSize; x++) {
      currentGeneration[x] = new Array(this.worldSize);
      for (let y = 0; y < this.worldSize; y++) {
        currentGeneration[x][y] = new Array(this.worldSize).fill(false);
      }
    }
    return currentGeneration;
  }

  private createFramebox(): void {
    const frameBoxSize =
      this.worldSize * (this.cellSize + this.cellOffset) - this.cellSize;
    const frameBoxGeometry = new THREE.BoxGeometry(
      frameBoxSize,
      frameBoxSize,
      frameBoxSize,
    );
    const frameBoxEdgeGeometry = new THREE.EdgesGeometry(frameBoxGeometry);
    const frameBox = new THREE.LineSegments(
      frameBoxEdgeGeometry,
      new THREE.LineBasicMaterial({ color: 0x00ffff }),
    );

    frameBox.position.set(0, 0, 0);
    scene.add(frameBox);
  }
}
