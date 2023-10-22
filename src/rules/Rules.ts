import { Neighborhood } from "./Neighborhood"

export class Rules {
    static apply445M(world: number[][][], x: number, y: number, z: number): number {
      const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);
  
      let state = world[x][y][z];
      let aliveNeighbors = 0;
  
      for (const [nx, ny, nz] of neighbors) {
        if (nx >= 0 && nx < world.length &&
            ny >= 0 && ny < world[0].length &&
            nz >= 0 && nz < world[0][0].length) {
          if (world[nx][ny][nz] > 0) {
            aliveNeighbors++;
          }
        }
      }
  
      // Apply rules
      if (state === 1 && aliveNeighbors === 4) {
        return 1; // Survives
      } else if (state === 0 && aliveNeighbors === 4) {
        return 4; // Born (newly born)
      } else if (state === 4) {
        return 1; // Fades to state 1
      }
  
      return 0; // No cell
    }
  }
  