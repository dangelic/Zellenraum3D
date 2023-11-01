import * as THREE from 'three';
import { scene } from '../renderer';
import {ColorMapper} from './ColorMapper'

export class World3D {
  private worldSize: number;
  private cellSize: number;
  private cellOffset: number;

  private cellMesh: THREE.InstancedMesh

  private matrix: THREE.Matrix4

  private colorMode: string

  private currentGeneration: boolean[][][];
  private generationCount: number;

  private frameBox: THREE.LineSegments;
  public cellMeshContainer: THREE.Object3D;
  public frameBoxContainer: THREE.Object3D;

  public constructor(worldSize: number, cellSize: number, cellOffset: number, colorMode?) {
    this.worldSize = worldSize;
    this.cellSize = cellSize;
    this.cellOffset = cellOffset;

    this.currentGeneration = this.createEmptyGeneration();
    this.generationCount = 0;

    this.colorMode = "standard"

    this.matrix = new THREE.Matrix4()

    this.cellMeshContainer = new THREE.Object3D();
    this.frameBoxContainer = new THREE.Object3D();

    this.frameBox = this.createFramebox();
    this.frameBoxContainer.add(this.frameBox);

    scene.add(this.cellMeshContainer);
    // scene.add(this.frameBoxContainer);
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

  private constructCellMesh = (): void => {
    // Clear current cell mesh setup
    this.cellMeshContainer.clear();

    // Initialize new cell mesh and add it to the scene
    const geometry = new THREE.BoxGeometry(
      this.cellSize,
      this.cellSize,
      this.cellSize
    );
    const material = new THREE.MeshBasicMaterial({ wireframe: true });
    const numInstances = Math.pow(this.worldSize, 3);
    this.cellMesh = new THREE.InstancedMesh(geometry, material, numInstances);
    this.cellMeshContainer.add(this.cellMesh);
  }

  private setCellColor = (meshI, x,y,z): void => {
    let rgb;
    switch (this.colorMode) {
      case "standard": 
        rgb = ColorMapper.mapPositionToColor(this.currentGeneration, x, y, z);
        break;
    }
    this.cellMesh.setColorAt(meshI, new THREE.Color(rgb));
    this.cellMesh.instanceColor.needsUpdate = true;
  }

  private addCellsToScene = (): void => {
    // Create new InstancedMesh and add it to the container
    this.constructCellMesh()
  
    for (let x = 0; x < this.worldSize; x++) {
      for (let y = 0; y < this.worldSize; y++) {
        for (let z = 0; z < this.worldSize; z++) {
          let isCellVisible = this.currentGeneration[x][y][z];
  
          if (isCellVisible) {
            this.matrix.setPosition(
              (x - this.worldSize / 2) * (this.cellSize + this.cellOffset),
              (y - this.worldSize / 2) * (this.cellSize + this.cellOffset),
              (z - this.worldSize / 2) * (this.cellSize + this.cellOffset)
            );
            let meshI = x * this.worldSize * this.worldSize + y * this.worldSize + z;
            this.cellMesh.setMatrixAt(meshI, this.matrix);
            this.setCellColor(meshI, x,y,z)
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

  public createFramebox(): THREE.LineSegments {
    const frameBoxSize =
      this.worldSize * (this.cellSize + this.cellOffset) - this.cellSize;
    const frameBoxGeometry = new THREE.BoxGeometry(
      frameBoxSize,
      frameBoxSize,
      frameBoxSize
    );
    const frameBoxEdgeGeometry = new THREE.EdgesGeometry(frameBoxGeometry);
    const frameBox = new THREE.LineSegments(
      frameBoxEdgeGeometry,
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );
  
    frameBox.position.set(0, 0, 0);
    // scene.add(frameBox);
  
    return frameBox; // Return the frameBox object
  }  
}
