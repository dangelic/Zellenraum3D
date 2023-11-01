import { Neighborhood } from './Neighborhood';

// Info: Set rnd Seed to 0.5
export class Rules {
    static apply445(currentGenerationStates: string[][][]): [string[][][], boolean[][][]] {
        const worldSize = currentGenerationStates.length;
        const nextGeneration = new Array(worldSize);
        for (let x = 0; x < worldSize; x++) {
            nextGeneration[x] = new Array(worldSize);
            for (let y = 0; y < worldSize; y++) {
                nextGeneration[x][y] = new Array(worldSize).fill('STATE_0');
            }
        }

        for (let x = 0; x < worldSize; x++) {
            for (let y = 0; y < worldSize; y++) {
                for (let z = 0; z < worldSize; z++) {
                    const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);
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
                            if (currentGenerationStates[nx][ny][nz] === 'STATE_1') {
                                aliveNeighbors++;
                            }
                        }
                    }
                    if (currentGenerationStates[x][y][z] === 'STATE_0') {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = 'STATE_4';
                        else nextGeneration[x][y][z] = 'STATE_0';
                    }
                    if (currentGenerationStates[x][y][z] === 'STATE_1') {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = 'STATE_1';
                        else nextGeneration[x][y][z] = 'STATE_0';
                    }
                    if (currentGenerationStates[x][y][z] === 'STATE_2') {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = 'STATE_2';
                        else nextGeneration[x][y][z] = 'STATE_1';
                    }
                    if (currentGenerationStates[x][y][z] === 'STATE_3') {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = 'STATE_3';
                        else nextGeneration[x][y][z] = 'STATE_2';
                    }
                    if (currentGenerationStates[x][y][z] === 'STATE_4') {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = 'STATE_4';
                        else nextGeneration[x][y][z] = 'STATE_3';
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
                    if (
                        nextGeneration[x][y][z] === 'STATE_1' ||
                        nextGeneration[x][y][z] === 'STATE_2' ||
                        nextGeneration[x][y][z] === 'STATE_3' ||
                        nextGeneration[x][y][z] === 'STATE_4'
                    ) {
                        isCellVisible[x][y][z] = true;
                    }
                }
            }
        }
        return [nextGeneration, isCellVisible];
    }

    // Info: Set rnd Seed to 0.5
    static applyClouds(currentGenerationStates: string[][][]): [string[][][], boolean[][][]] {
        const worldSize = currentGenerationStates.length;

        // Create a new world array to store the next state
        const nextGeneration = new Array(worldSize);
        for (let x = 0; x < worldSize; x++) {
            nextGeneration[x] = new Array(worldSize);
            for (let y = 0; y < worldSize; y++) {
                nextGeneration[x][y] = new Array(worldSize).fill('STATE_0');
            }
        }

        for (let x = 0; x < worldSize; x++) {
            for (let y = 0; y < worldSize; y++) {
                for (let z = 0; z < worldSize; z++) {
                    const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);
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
                            if (currentGenerationStates[nx][ny][nz] === 'STATE_1') {
                                aliveNeighbors++;
                            }
                        }
                    }

                    // Apply rules based on the count of alive neighbors
                    if (currentGenerationStates[x][y][z] === 'STATE_1') {
                        if (aliveNeighbors >= 13 && aliveNeighbors <= 26) {
                            nextGeneration[x][y][z] = 'STATE_1'; // Cell survives with the specified range of neighbors
                        }
                    } else {
                        if (
                            (aliveNeighbors >= 13 && aliveNeighbors <= 14) ||
                            (aliveNeighbors >= 17 && aliveNeighbors <= 19)
                        ) {
                            nextGeneration[x][y][z] = 'STATE_1'; // Cell is born in an empty location with the specified range of neighbors
                        }
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
                    if (nextGeneration[x][y][z] === 'STATE_1') isCellVisible[x][y][z] = true;
                }
            }
        }
        return [nextGeneration, isCellVisible];
    }
}
