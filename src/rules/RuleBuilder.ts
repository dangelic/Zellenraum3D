import * as fs from "fs";
import * as path from "path";

import { Neighborhood } from "./Neighborhood";
import { GenerationStatesMatrix, CellVisibilityMatrix } from "../types/Types";

export class RuleBuilder {

    private ruleName: string;
    private properties;

    public constructor(ruleName) {
        this.ruleName = ruleName;
        // this.properties = this.fetchRulePropertiesFromPredefinedSet(this.ruleName)

        this.properties = {
            "life_values": [4],
            "death_values": [4],
            "num_states": 5,
            "neighborhood": "M"
        }
    }

    public  buildRuleFromPredefinedSet(
        currentGenerationStates: GenerationStatesMatrix,
    ): [GenerationStatesMatrix, CellVisibilityMatrix] {

        const neighborhood: string = this.properties.neighborhood;
        const lifeValues = this.properties.life_values;
        const deathValues = this.properties.death_values;
        const numStates = this.properties.num_states;

        const worldSize = currentGenerationStates.length;
        const nextGeneration = this.initializeNextGenerationArray(currentGenerationStates);

        // Apply rules based on alive neighbors
        for (let x = 0; x < worldSize; x++) {
            for (let y = 0; y < worldSize; y++) {
                for (let z = 0; z < worldSize; z++) {
                    const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);
                    let aliveNeighbors = 0;
                    aliveNeighbors = this.countAliveNeighbors(currentGenerationStates, neighbors);

                    let stateString = currentGenerationStates[x][y][z]
                    let state = parseInt(stateString.match(/\d+/)[0]);

                    if (state === 0) {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = "STATE_4";
                        else nextGeneration[x][y][z] = "STATE_0";
                    } else {
                        if (aliveNeighbors === 4) nextGeneration[x][y][z] = `STATE_${state}`;
                        
                        else {
                            state = state -1
                            nextGeneration[x][y][z] = `STATE_${state}`;
                        }
                }}
            }
        }
        
        
        const notVisibleStates = ["STATE_0"];
        const isCellVisible = this.calculateIsCellVisible(nextGeneration, notVisibleStates);
        return [nextGeneration, isCellVisible];
    }

    private  fetchRulePropertiesFromPredefinedSet(ruleName) {
        try {
            // Read predefinedRuleSet.json file
            const filePath = path.join(__dirname, "predefinedRuleSet.json");

            // Read the predefinedRuleSet.json file
            const rawData = fs.readFileSync(filePath, "utf8");
            const predefinedRules = JSON.parse(rawData);

            // Search for the rule with the matching name
            const matchingRule = predefinedRules.find((rule) => rule.name === ruleName);

            if (matchingRule) {
                // If a matching rule is found, return its properties
                return matchingRule.properties;
            } else {
                throw new Error(`Rule '${ruleName}' not found in the predefinedRuleSet.`);
            }
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    private  initializeNextGenerationArray(currentGenerationStates): GenerationStatesMatrix {
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
    private  countAliveNeighbors(
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
                if (currentGenerationStates[nx][ny][nz] != "STATE_0") {
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
    private  calculateIsCellVisible(
        nextGeneration: GenerationStatesMatrix,
        notVisibleStates: string[],
    ): CellVisibilityMatrix {
        const worldSize = nextGeneration.length;
        const isCellVisible = new Array(worldSize);
        for (let x = 0; x < worldSize; x++) {
            isCellVisible[x] = new Array(worldSize);
            for (let y = 0; y < worldSize; y++) {
                isCellVisible[x][y] = new Array(worldSize);
                for (let z = 0; z < worldSize; z++) {
                    if (nextGeneration[x][y][z] === "STATE_0")
                        isCellVisible[x][y][z] = false;
                    else isCellVisible[x][y][z] = true;
                }
            }
        }
        return isCellVisible;
    }
}
