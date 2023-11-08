import * as fs from "fs";
import * as path from "path";
import { predefinedRuleSet } from "./predefinedRuleSet";

import { Neighborhood } from "./Neighborhood";
import { GenerationStatesMatrix, CellVisibilityMatrix } from "../types/Types";

export class RuleBuilder {
    private ruleName: string;
    private properties;

    public constructor(ruleName) {
        this.ruleName = ruleName;
        // this.properties = this.fetchRulePropertiesFromPredefinedSet(this.ruleName)

        this.properties = this.getValidPredefinedRuleset(ruleName);
    }

    public buildRuleFromPredefinedSet(
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
                    let neighbors;
                    if (neighborhood === "M")
                        neighbors = Neighborhood.getMooreNeighborhood(x, y, z);
                    if (neighborhood === "VN")
                        neighbors = Neighborhood.getvonNeumannNeighborhood(x, y, z);
                    let aliveNeighbors = 0;
                    aliveNeighbors = this.countAliveNeighbors(currentGenerationStates, neighbors);

                    let stateString = currentGenerationStates[x][y][z];
                    let state = parseInt(stateString.match(/\d+/)[0]);

                    if (state === 0) {
                        if (lifeValues.includes(aliveNeighbors)) nextGeneration[x][y][z] = `STATE_${numStates-1}`;
                        else nextGeneration[x][y][z] = "STATE_0";
                    } else {
                        if (deathValues.includes(aliveNeighbors)) nextGeneration[x][y][z] = `STATE_${state}`;
                        else {
                            nextGeneration[x][y][z] = `STATE_${state-1}`;
                        }
                    }
                }
            }
        }

        const notVisibleStates = ["STATE_0"];
        const isCellVisible = this.calculateIsCellVisible(nextGeneration, notVisibleStates);
        return [nextGeneration, isCellVisible];
    }

    private getValidPredefinedRuleset(ruleNameInput) {
        const rule = predefinedRuleSet.find((rule) => rule.name === ruleNameInput);
        return rule ? rule.properties : null;
    }

    private initializeNextGenerationArray(currentGenerationStates): GenerationStatesMatrix {
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
    private countAliveNeighbors(
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
    private calculateIsCellVisible(
        nextGeneration: GenerationStatesMatrix,
        visibleStates: string[],
    ): CellVisibilityMatrix {
        console.log(visibleStates);
        const worldSize = nextGeneration.length;
        const isCellVisible = new Array(worldSize);
        for (let x = 0; x < worldSize; x++) {
            isCellVisible[x] = new Array(worldSize);
            for (let y = 0; y < worldSize; y++) {
                isCellVisible[x][y] = new Array(worldSize);
                for (let z = 0; z < worldSize; z++) {
                    if (visibleStates.includes(nextGeneration[x][y][z])) {
                        isCellVisible[x][y][z] = false;
                    } else {
                        isCellVisible[x][y][z] = true;
                    }
                }
            }
        }
        return isCellVisible;
    }
}
