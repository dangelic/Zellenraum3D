import { Neighborhood } from "./Neighborhood";

export class Rules {


  static customRule(
    world: boolean[][][],
    x: number,
    y: number,
    z: number,
  ): boolean {
    const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);

    let aliveNeighbors = 0;

    for (const [nx, ny, nz] of neighbors) {
      if (
        nx >= 0 &&
        nx < world.length &&
        ny >= 0 &&
        ny < world[0].length &&
        nz >= 0 &&
        nz < world[0][0].length
      ) {
        if (world[nx][ny][nz]) {
          aliveNeighbors++;
        }
      }
    }

    // Apply custom rules based on the count of alive neighbors
    if (world[x][y][z]) {
      // Any live cell with 5-6 live neighbors survives.
      if (aliveNeighbors >= 5 && aliveNeighbors <= 6) {
        return true; // Cell survives
      } else {
        return false; // Cell dies
      }
    } else {
      // Any dead cell with 4 live neighbors becomes a live cell.
      if (aliveNeighbors === 4) {
        return true; // Cell is born
      } else {
        return false; // Cell stays dead
      }
    }
  }

  static apply445M(
    world: boolean[][][],
    x: number,
    y: number,
    z: number,
  ): string {
    const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);

    let aliveNeighbors = 0;

    for (const [nx, ny, nz] of neighbors) {
      if (
        nx >= 0 &&
        nx < world.length &&
        ny >= 0 &&
        ny < world[0].length &&
        nz >= 0 &&
        nz < world[0][0].length
      ) {
        if (world[nx][ny][nz]) {
          aliveNeighbors++;
        }
      }
    }

    // Apply rules based on the count of alive neighbors
    if (world[x][y][z]) {
      if (aliveNeighbors === 4) {
        return 'survives'; // Cell survives with 4 neighbors
      } else {
        return 'died'; // Cell dies with any other number of neighbors
      }
    } else {
      if (aliveNeighbors === 4) {
        return 'born'; // Cell is born in an empty location with 4 neighbors
      }
    }

    return 'empty'; // No cell
  }
}