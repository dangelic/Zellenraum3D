export class Neighborhood {
  static getvonNeumannNeighborhood(
    x: number,
    y: number,
    z: number,
  ): [number, number, number][] {
    const neighbors: [number, number, number][] = [];

    // Define relative positions for neighbors in a cross
    const relativePositions = [
      [0, 0, 1], // North
      [0, 0, -1], // South
      [0, 1, 0], // Above
      [0, -1, 0], // Under
      [1, 0, 0], // East
      [-1, 0, 0], // West
    ];

    // Calculate neighbors' coordinates
    for (const [dx, dy, dz] of relativePositions) {
      const neighborX = x + dx;
      const neighborY = y + dy;
      const neighborZ = z + dz;

      neighbors.push([neighborX, neighborY, neighborZ]);
    }

    return neighbors;
  }

  static getMooreNeighborhood(
    x: number,
    y: number,
    z: number,
  ): [number, number, number][] {
    const neighbors: [number, number, number][] = [];

    // Define relative positions for Moore neighbors
    const relativePositions = [
      [-1, -1, -1], // Southwest Down
      [-1, -1, 0],  // West Down
      [-1, -1, 1],  // Northwest Down
      [-1, 0, -1],  // South Down
      [-1, 0, 0],   // Down
      [-1, 0, 1],   // North Down
      [-1, 1, -1],  // Southeast Down
      [-1, 1, 0],   // East Down
      [-1, 1, 1],   // Northeast Down
    
      [0, -1, -1],  // South
      [0, -1, 0],   // Down
      [0, -1, 1],   // North
      [0, 0, -1],   // South Down
      [0, 0, 1],    // North Down
      [0, 1, -1],   // Southeast
      [0, 1, 0],    // East
      [0, 1, 1],    // Northeast
    
      [1, -1, -1],  // Southwest Up
      [1, -1, 0],   // West Up
      [1, -1, 1],   // Northwest Up
      [1, 0, -1],   // South Up
      [1, 0, 0],    // Up
      [1, 0, 1],    // North Up
      [1, 1, -1],   // Southeast Up
      [1, 1, 0],    // East Up
      [1, 1, 1],    // Northeast Up
    ];
    

    // Calculate Moore neighbors' coordinates
    for (const [dx, dy, dz] of relativePositions) {
      const neighborX = x + dx;
      const neighborY = y + dy;
      const neighborZ = z + dz;

      neighbors.push([neighborX, neighborY, neighborZ]);
    }

    return neighbors;
  }
}