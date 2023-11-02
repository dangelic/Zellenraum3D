import { GenerationStatesMatrix, CellVisibilityMatrix } from "../types/Types";

/**
 * Utility class for generating seed patterns for a cellular automaton.
 */
export class Seeds {
    /**
     * Generates a random seed with the given probability for cell activation.
     *
     * @param currentGenerationStates - The current generation state of the cellular automaton.
     * @param probability - The probability of a cell being activated (0 to 1).
     * @returns A tuple containing the seeded generation state and cell visibility information.
     */
    static getRandomSeed(
        currentGenerationStates: GenerationStatesMatrix,
        probability: number,
    ): [GenerationStatesMatrix, CellVisibilityMatrix] {
        const worldSize = currentGenerationStates.length;
        const seededGeneration: GenerationStatesMatrix = [];

        for (let x = 0; x < worldSize; x++) {
            seededGeneration[x] = [];

            for (let y = 0; y < worldSize; y++) {
                seededGeneration[x][y] = [];

                for (let z = 0; z < worldSize; z++) {
                    // Generate a random number between 0 and 1
                    const randomValue = Math.random();

                    // Set the cell value to true if the random number is less than the probability

                    if (randomValue < probability) {
                        seededGeneration[x][y][z] = "STATE_1";
                    } else {
                        seededGeneration[x][y][z] = "STATE_0";
                    }
                }
            }
        }
        const visibleStates = ["STATE_1"];
        const isCellVisible = this.calculateIsCellVisible(seededGeneration, visibleStates);
        return [seededGeneration, isCellVisible];
    }

    /**
     * Generates a clustered seed with the specified cluster size and activation probability.
     *
     * @param currentGenerationStates - The current generation state of the cellular automaton.
     * @param clusterSize - The size of the cluster for seed generation.
     * @param probability - The probability of a cell being activated (0 to 1) within the cluster.
     * @returns A tuple containing the seeded generation state and cell visibility information.
     */
    static getClusteredSeed(
        currentGenerationStates: GenerationStatesMatrix,
        clusterSize: number,
        probability: number,
    ): [GenerationStatesMatrix, CellVisibilityMatrix] {
        const worldSize = currentGenerationStates.length;
        const seededGeneration: GenerationStatesMatrix = [];

        const centerX = Math.floor(worldSize / 2);
        const centerY = Math.floor(worldSize / 2);
        const centerZ = Math.floor(worldSize / 2);

        for (let x = 0; x < worldSize; x++) {
            seededGeneration[x] = [];

            for (let y = 0; y < worldSize; y++) {
                seededGeneration[x][y] = [];

                for (let z = 0; z < worldSize; z++) {
                    // Set the cell value to true if it is within the cluster size of the center
                    const distance = Math.sqrt(
                        (x - centerX) ** 2 + (y - centerY) ** 2 + (z - centerZ) ** 2,
                    );
                    const randomValue = Math.random();
                    if (distance < clusterSize && randomValue < probability)
                        seededGeneration[x][y][z] = "STATE_1";
                    else seededGeneration[x][y][z] = "STATE_0";
                }
            }
        }
        const visibleStates = ["STATE_1"];
        const isCellVisible = this.calculateIsCellVisible(seededGeneration, visibleStates);
        return [seededGeneration, isCellVisible];
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
