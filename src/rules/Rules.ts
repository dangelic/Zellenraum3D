import { Neighborhood } from './Neighborhood';

export class Rules {
  static apply445M(
    world: boolean[][][],
    x: number,
    y: number,
    z: number,
  ): string {
    const neighbors = Neighborhood.getMooreNeighborhood(x, y, z);

    let currentState = world[x][y][z];
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
    if (currentState) {
      if (aliveNeighbors < 4) {
        return 'died'; // Cell dies (lonely cells)
      } else {
        return 'survives'; // Cell survives
      }
    } else {
      if (aliveNeighbors === 4) {
        return 'born'; // Cell is born
      }
    }

    return 'empty'; // No cell
  }
}