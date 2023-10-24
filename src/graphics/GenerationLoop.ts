import { World3D } from "./World3D";
import { Rules } from "../rules/Rules";

export class GenerationLoop {
    public static startGenerationLoop(initialCellArray: boolean[][][]) {
        const interval = 100; // Time between updates (in milliseconds)
        let cellArray = initialCellArray;
        let generations = 0; // Track the number of generations

        const updateCellVisibility = () => {
            if (generations >= 100) {
                // Stop after 5 generations
                World3D.getInstance().clearWorld();
                return;
            }

            for (let x = 0; x < cellArray.length; x++) {
                for (let y = 0; y < cellArray[0].length; y++) {
                    for (let z = 0; z < cellArray[0][0].length; z++) {
                        const result = Rules.customRule(cellArray, x, y, z);
                        if (result) {
                            cellArray[x][y][z] = true;
                        } else {
                            cellArray[x][y][z] = false;
                        }
                    }
                }
            }
            console.log(cellArray)
            // Update the 3D world with the new cell array

            World3D.getInstance().clearWorld()

            
            World3D.getInstance().addCubesPreload(100, cellArray);

            generations++; // Increment the generation count

            // Schedule the next update
            setTimeout(updateCellVisibility, interval);
        };

        // Start the update loop
        updateCellVisibility();
    }
}