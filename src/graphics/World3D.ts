import * as THREE from "three";
import { scene } from "../renderer";
import { ColorMapper } from "./ColorMapper";
import { GenerationStatesMatrix, CellVisibilityMatrix } from "../types/Types";

/**
 * This class represents a 3D box world where cells are trapped in.
 * It is responsible for creating all visible elements of the core visualization (outer framebox, cells, ...)
 */
export class World3D {
    private worldSize: number;
    private cellSize: number;
    private cellOffset: number;

    private cellMesh: THREE.InstancedMesh;

    private matrix: THREE.Matrix4;

    private colorMode: string;

    private currentGenerationStates: GenerationStatesMatrix;
    private generationCount: number;

    private frameBox: THREE.LineSegments;
    public cellMeshContainer: THREE.Object3D;
    public frameBoxContainer: THREE.Object3D;

    /**
     * CONSTRUCTOR
     *
     * @param worldSize - The size of the 3D world.
     * @param cellSize - The size of each cell.
     * @param cellOffset - The offset between cells.
     * @param colorMode - The color mode for cell visualization (see: ./ColorMapper.ts for enum)
     */
    public constructor(worldSize: number, cellSize: number, cellOffset: number, colorMode) {
        this.worldSize = worldSize;
        this.cellSize = cellSize;
        this.cellOffset = cellOffset;

        this.currentGenerationStates = this.createEmptyGeneration();
        this.generationCount = 0;

        this.colorMode = colorMode;

        this.matrix = new THREE.Matrix4();

        this.cellMeshContainer = new THREE.Object3D();
        this.frameBoxContainer = new THREE.Object3D();

        this.frameBox = this.createFramebox();
        this.frameBoxContainer.add(this.frameBox);

        scene.add(this.cellMeshContainer);
    }

    // Getter & Setter

    /**
     * Getter for current generation's states.
     *
     * @returns The current generation's states.
     */
    public getCurrentGenerationStates(): GenerationStatesMatrix {
        return this.currentGenerationStates;
    }

    /**
     * Setter for current generation's states and update the visualization.
     *
     * @param currentGenerationStates - The new generation's states.
     * @param isCellVisible - The visibility matrix for cells.
     */
    public setCurrentGenerationStates(
        currentGenerationStates: GenerationStatesMatrix,
        isCellVisible: CellVisibilityMatrix,
    ): void {
        this.generationCount++; // Adjust the counter
        // console.log('Generation Count: ' + this.generationCount);

        this.currentGenerationStates = currentGenerationStates;
        this.addCellsToScene(isCellVisible);
    }

    /**
     * Constructs the cell mesh cubes using InstancedMesh
     *
     */
    private constructCellMesh = (): void => {
        // Clear current cell mesh setup
        this.cellMeshContainer.clear();

        // Initialize new cell mesh and add it to the scene
        const geometry = new THREE.BoxGeometry(this.cellSize, this.cellSize, this.cellSize);
        const material = new THREE.MeshStandardMaterial({ wireframe: false }); // Set wireframe: true for testing performance
        const numInstances = Math.pow(this.worldSize, 3);
        this.cellMesh = new THREE.InstancedMesh(geometry, material, numInstances);
        this.cellMeshContainer.add(this.cellMesh);
    };

    /**
     * Set the color of a cell at a specific position in the cell mesh based on the color mode.
     *
     * @param meshI - The index of the cell in the instanced mesh.
     * @param x - The X-coordinate of the cell's position in the world.
     * @param y - The Y-coordinate of the cell's position in the world.
     * @param z - The Z-coordinate of the cell's position in the world.
     */
    private setCellColor = (meshI, x, y, z): void => {
        let rgb;
        switch (this.colorMode) {
            case "standard":
                rgb = ColorMapper.mapPositionToColor(this.currentGenerationStates, x, y, z);
                break;
            case "random":
                rgb = ColorMapper.getRandomColor();
                break;
            case "5state":
                rgb = ColorMapper.get5StateColor(this.currentGenerationStates, x, y, z);
                break;
        }
        this.cellMesh.setColorAt(meshI, new THREE.Color(rgb));
        this.cellMesh.instanceColor.needsUpdate = true; // Important to not forget this when handling InstancedMeshes
    };

    /**
     * Add cells to the 3D scene based on their visibility and set their positions and colors.
     *
     * @param isCellVisible - The visibility matrix for cells.
     */
    private addCellsToScene(isCellVisible: CellVisibilityMatrix): void {
        // Create a new InstancedMesh and add it to the container
        this.constructCellMesh();

        for (let x = 0; x < this.worldSize; x++) {
            for (let y = 0; y < this.worldSize; y++) {
                for (let z = 0; z < this.worldSize; z++) {
                    let visible = isCellVisible[x][y][z];

                    if (visible) {
                        // Calculate the position for the cell based on its coordinates
                        this.matrix.setPosition(
                            (x - this.worldSize / 2) * (this.cellSize + this.cellOffset),
                            (y - this.worldSize / 2) * (this.cellSize + this.cellOffset),
                            (z - this.worldSize / 2) * (this.cellSize + this.cellOffset),
                        );

                        // Calculate the index of the cell in the instanced mesh
                        let meshI = x * this.worldSize * this.worldSize + y * this.worldSize + z;

                        // Set the cell's position and color
                        this.cellMesh.setMatrixAt(meshI, this.matrix);
                        this.setCellColor(meshI, x, y, z);
                    }
                }
            }
        }
    }

    /**
     * Create an empty generation with all cells in "STATE_0".
     * The first generation is always this empty one.
     *
     * @returns The empty generation's states.
     */
    private createEmptyGeneration(): GenerationStatesMatrix {
        const currentGenerationStates = new Array(this.worldSize);
        for (let x = 0; x < this.worldSize; x++) {
            currentGenerationStates[x] = new Array(this.worldSize);
            for (let y = 0; y < this.worldSize; y++) {
                currentGenerationStates[x][y] = new Array(this.worldSize).fill("STATE_0");
            }
        }
        return currentGenerationStates;
    }

    /**
     * Create a framebox for the 3D world.
     *
     * @returns The framebox as a LineSegments object.
     */
    public createFramebox(): THREE.LineSegments {
        const frameBoxSize = this.worldSize * (this.cellSize + this.cellOffset) + this.cellSize;
        const frameBoxGeometry = new THREE.BoxGeometry(frameBoxSize, frameBoxSize, frameBoxSize);
        const frameBoxEdgeGeometry = new THREE.EdgesGeometry(frameBoxGeometry);
        const frameBox = new THREE.LineSegments(
            frameBoxEdgeGeometry,
            new THREE.LineBasicMaterial({ color: 0x00ff00 }),
        );

        frameBox.position.set(0, 0, 0);

        return frameBox; // Return the frameBox object
    }
}
