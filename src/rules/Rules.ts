import { Neighborhood } from './Neighborhood';

export class Rules {
  static apply445M(
    world: number[][][],
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
        if (world[nx][ny][nz] === 1) {
          aliveNeighbors++;
        }
      }
    }

    // Apply rules based on the count of alive neighbors
    if (currentState === 1) {
      if (aliveNeighbors === 4) {
        return 'survives'; // Cell survives
      } else {
        return 'died'; // Cell dies
      }
    } else {
      if (aliveNeighbors === 4) {
        return 'born'; // Cell is born
      }
    }

    return 'empty'; // No cell
  }
}
