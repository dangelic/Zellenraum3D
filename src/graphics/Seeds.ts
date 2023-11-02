export class Seeds {
    static getRandomSeed(
        currentGenerationStates: string[][][],
        probability: number,
    ): [string[][][], boolean[][][]] {
        const worldSize = currentGenerationStates.length;
        const seededWorld: string[][][] = [];

        for (let x = 0; x < worldSize; x++) {
            seededWorld[x] = [];

            for (let y = 0; y < worldSize; y++) {
                seededWorld[x][y] = [];

                for (let z = 0; z < worldSize; z++) {
                    // Generate a random number between 0 and 1
                    const randomValue = Math.random();

                    // Set the cell value to true if the random number is less than the probability

                    if (randomValue < probability) {
                        seededWorld[x][y][z] = "STATE_1";
                    } else {
                        seededWorld[x][y][z] = "STATE_0";
                    }
                }
            }
        }
        let isCellVisible = new Array(worldSize);
        for (let x = 0; x < worldSize; x++) {
            isCellVisible[x] = new Array(worldSize);
            for (let y = 0; y < worldSize; y++) {
                isCellVisible[x][y] = new Array(worldSize);
                for (let z = 0; z < worldSize; z++) {
                    if (seededWorld[x][y][z] === "STATE_1") isCellVisible[x][y][z] = true;
                }
            }
        }

        return [seededWorld, isCellVisible];
    }

    static getClusteredSeed(
        currentGenerationStates: string[][][],
        clusterSize: number,
        probability: number,
    ): [string[][][], boolean[][][]] {
        const worldSize = currentGenerationStates.length;
        const seededWorld: string[][][] = [];

        const centerX = Math.floor(worldSize / 2);
        const centerY = Math.floor(worldSize / 2);
        const centerZ = Math.floor(worldSize / 2);

        for (let x = 0; x < worldSize; x++) {
            seededWorld[x] = [];

            for (let y = 0; y < worldSize; y++) {
                seededWorld[x][y] = [];

                for (let z = 0; z < worldSize; z++) {
                    // Set the cell value to true if it is within the cluster size of the center
                    const distance = Math.sqrt(
                        (x - centerX) ** 2 + (y - centerY) ** 2 + (z - centerZ) ** 2,
                    );
                    const randomValue = Math.random();
                    if (distance < clusterSize && randomValue < probability)
                        seededWorld[x][y][z] = "STATE_1";
                    else seededWorld[x][y][z] = "STATE_0";
                }
            }
        }
        let isCellVisible = new Array(worldSize);
        for (let x = 0; x < worldSize; x++) {
            isCellVisible[x] = new Array(worldSize);
            for (let y = 0; y < worldSize; y++) {
                isCellVisible[x][y] = new Array(worldSize);
                for (let z = 0; z < worldSize; z++) {
                    if (seededWorld[x][y][z] === "STATE_1") isCellVisible[x][y][z] = true;
                }
            }
        }

        return [seededWorld, isCellVisible];
    }
}
