import { Rule } from "../rules/Rule";
import { Seed } from "./Seed";
import { World3D } from "./World3D";

export class GenerationLoop {
    private seed: Seed;
    private msDelay: number;
    private world3D: World3D;
    private seedProbability: number;
    private rule: Rule;
    private currentGeneration: boolean[][][]; // Change the type to number[][][]

    public constructor(seed: Seed, seedProbability: number, msDelay: number) {
        this.rule = new Rule();
        this.seed = seed;
        this.msDelay = msDelay;
        this.world3D = World3D.getInstance();
        this.seedProbability = seedProbability;
        this.currentGeneration = Seed.getRandomSeed(this.world3D.getCellArray(), this.seedProbability);
    }

    public startLoop() {
        let generationCount = 0; // Initialize a variable to count generations
    
        const maxGenerations = 10; // Set the maximum number of generations
    
        const interval = setInterval(() => {
            // Assemble the array for the next generation based on the rules
            const nextGeneration = this.assembleNextGeneration(this.currentGeneration);
        
            // Add cubes to the world for the current generation
            this.world3D.addCubesInstantly(this.currentGeneration);
        
            // Clear the world to prepare for the next generation
            this.world3D.clearWorld();
        
            // Update the current generation with the next generation
            this.currentGeneration = nextGeneration;

            console.log(this.currentGeneration)
    
            generationCount++; // Increment the generation count
    
            // Check if the maximum number of generations is reached
            if (generationCount >= maxGenerations) {
                clearInterval(interval); // Stop the loop when the condition is met
            }
        }, this.msDelay);
    }
    
    

    private assembleNextGeneration(currentGeneration: boolean[][][]): boolean[][][] {
        const nextGeneration: boolean[][][] = [];
        const size = this.world3D.getWorldSize();
    
        for (let x = 0; x < size; x++) {
            nextGeneration[x] = [];
            for (let y = 0; y < size; y++) {
                nextGeneration[x][y] = [];
                for (let z = 0; z < size; z++) {
                    const result = Rule.apply445M(currentGeneration, x, y, z);
                    nextGeneration[x][y][z] = result === 'survives' || result === 'born';
                }
            }
        }
    
        return nextGeneration;
    }      
}