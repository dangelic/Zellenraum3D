import { Neighborhood } from "./Neighborhood";
import { GenerationStatesMatrix, CellVisibilityMatrix } from "../types/Types";

/**
 * Class collecting all applicable rules for cell state transitions, affecting cell survival.
 * A State-System is implemented to realize Binary- and Multi-State-Rules:
 *          - Binary: Only two states: STATE_0 (dead) and STATE_1 (alive) (e.g. Clouds)
 *          - Multiple-State: Different states can be applied saved (e.g. State 4 fades to 3, 2, 1 ... in Rule-445)
 */
export class Rules {
    /**
     * Apply rule 445 to the current generation states.
     * Info: Best if ClusteredSeed with size = 10 and p = 0.1 is taken
     *
     * @param currentGenerationStates - The current state of the cellular automaton.
     * @returns A tuple containing the next generation states and the visibility of cells.
     */
    public static apply445(
        currentGenerationStates: GenerationStatesMatrix,
    ): [GenerationStatesMatrix, CellVisibilityMatrix] {
        const worldSize = currentGenerationStates.length;
        const nextGeneration = this.initializeNextGenerationArray(currentGenerationStates);

        // Apply rules based on alive neighbors
        for (let x = 0; x < worldSize; x++) {
            for (let y = 0; y < worldSize; y++) {
                for (let z = 0; z < worldSize; z++) {
                    const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);
                    let aliveNeighbors = 0;
                    aliveNeighbors = this.countAliveNeighbors(currentGenerationStates, neighbors);

                    if (currentGenerationStates[x][y][z] === "STATE_0") {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = "STATE_4";
                        else nextGeneration[x][y][z] = "STATE_0";
                    }
                    if (currentGenerationStates[x][y][z] === "STATE_1") {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = "STATE_1";
                        else nextGeneration[x][y][z] = "STATE_0";
                    }
                    if (currentGenerationStates[x][y][z] === "STATE_2") {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = "STATE_2";
                        else nextGeneration[x][y][z] = "STATE_1";
                    }
                    if (currentGenerationStates[x][y][z] === "STATE_3") {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = "STATE_3";
                        else nextGeneration[x][y][z] = "STATE_2";
                    }
                    if (currentGenerationStates[x][y][z] === "STATE_4") {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = "STATE_4";
                        else nextGeneration[x][y][z] = "STATE_3";
                    }
                }
            }
        }

        // Transform states into visible state array (simply true or false)
        const visibleStates = ["STATE_1", "STATE_2", "STATE_3", "STATE_4"];
        const isCellVisible = this.calculateIsCellVisible(nextGeneration, visibleStates);

        return [nextGeneration, isCellVisible];
    }

    /**
     * Apply cloud rules to the current generation states.
     *
     * @param currentGenerationStates - The current state of the cellular automaton.
     * @returns A tuple containing the next generation states and the visibility of cells.
     */
    public static applyClouds(
        currentGenerationStates: GenerationStatesMatrix,
    ): [GenerationStatesMatrix, CellVisibilityMatrix] {
        // Initialize the next generation with "STATE_0"
        const worldSize = currentGenerationStates.length;
        const nextGeneration = this.initializeNextGenerationArray(currentGenerationStates);

        for (let x = 0; x < worldSize; x++) {
            for (let y = 0; y < worldSize; y++) {
                for (let z = 0; z < worldSize; z++) {
                    const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);
                    let aliveNeighbors = this.countAliveNeighbors(
                        currentGenerationStates,
                        neighbors,
                    );

                    // Apply rules based on the count of alive neighbors
                    if (currentGenerationStates[x][y][z] === "STATE_1") {
                        // Cell survives with the specified range of neighbors
                        if (aliveNeighbors >= 13 && aliveNeighbors <= 26)
                            nextGeneration[x][y][z] = "STATE_1";
                    } else {
                        // Cell is born in an empty location with the specified range of neighbors
                        if (
                            (aliveNeighbors >= 13 && aliveNeighbors <= 14) ||
                            (aliveNeighbors >= 17 && aliveNeighbors <= 19)
                        )
                            nextGeneration[x][y][z] = "STATE_1";
                    }
                }
            }
        }

        const visibleStates = ["STATE_1"];
        const isCellVisible = this.calculateIsCellVisible(nextGeneration, visibleStates);
        return [nextGeneration, isCellVisible];
    }

    /**
     * Initializes array with all values set to STATE_0 (dead).
     *
     * @param currentGenerationStates - The current state of the cellular automaton.
     * @returns The initial nextGeneration Array.
     */
    private static initializeNextGenerationArray(currentGenerationStates): GenerationStatesMatrix {
        const worldSize = currentGenerationStates.length;
        const nextGeneration = new Array(worldSize);
        for (let x = 0; x < worldSize; x++) {
            nextGeneration[x] = new Array(worldSize);
            for (let y = 0; y < worldSize; y++) {
                nextGeneration[x][y] = new Array(worldSize).fill("STATE_0");
            }
        }
        return nextGeneration;
    }

    /**
     * Count the number of alive neighbors for a given cell.
     *
     * @param currentGenerationStates - The current state of the cellular automaton.
     * @param neighbors - The coordinates of neighboring cells.
     * @returns The count of alive neighbors.
     */
    private static countAliveNeighbors(
        currentGenerationStates: GenerationStatesMatrix,
        neighbors: number[][],
    ): number {
        const worldSize = currentGenerationStates.length;
        let aliveNeighbors = 0;
        for (const [nx, ny, nz] of neighbors) {
            if (
                nx >= 0 &&
                nx < worldSize &&
                ny >= 0 &&
                ny < worldSize &&
                nz >= 0 &&
                nz < worldSize
            ) {
                if (currentGenerationStates[nx][ny][nz] === "STATE_1") {
                    aliveNeighbors++;
                }
            }
        }
        return aliveNeighbors;
    }

    /**
     * Calculate the visibility of cells in the next generation based on specified visible states.
     *
     * @param nextGeneration - The next generation state of the cellular automaton.
     * @param visibleStates - The states that result in cells being visible.
     * @returns A boolean matrix indicating cell visibility.
     */
    private static calculateIsCellVisible(
        nextGeneration: GenerationStatesMatrix,
        visibleStates: string[],
    ): CellVisibilityMatrix {
        const worldSize = nextGeneration.length;
        const isCellVisible = new Array(worldSize);
        for (let x = 0; x < worldSize; x++) {
            isCellVisible[x] = new Array(worldSize);
            for (let y = 0; y < worldSize; y++) {
                isCellVisible[x][y] = new Array(worldSize);
                for (let z = 0; z < worldSize; z++) {
                    if (visibleStates.includes(nextGeneration[x][y][z])) {
                        isCellVisible[x][y][z] = true;
                    }
                }
            }
        }
        return isCellVisible;
    }
}
