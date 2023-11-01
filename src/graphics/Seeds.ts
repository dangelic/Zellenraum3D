export class Seeds {
  static getRandomSeed(
    world: boolean[][][],
    probability: number,
  ): boolean[][][] {
    const seededWorld: boolean[][][] = [];

    for (let x = 0; x < world.length; x++) {
      seededWorld[x] = [];

      for (let y = 0; y < world[0].length; y++) {
        seededWorld[x][y] = [];

        for (let z = 0; z < world[0][0].length; z++) {
          // Generate a random number between 0 and 1
          const randomValue = Math.random();

          // Set the cell value to true if the random number is less than the probability
          seededWorld[x][y][z] = randomValue < probability;
        }
      }
    }

    return seededWorld;
  }

  static getClusteredSeed(
    world: boolean[][][],
    clusterSize: number,
  ): boolean[][][] {
    const clusteredWorld: boolean[][][] = [];

    const centerX = Math.floor(world.length / 2);
    const centerY = Math.floor(world[0].length / 2);
    const centerZ = Math.floor(world[0][0].length / 2);

    for (let x = 0; x < world.length; x++) {
      clusteredWorld[x] = [];

      for (let y = 0; y < world[0].length; y++) {
        clusteredWorld[x][y] = [];

        for (let z = 0; z < world[0][0].length; z++) {
          // Set the cell value to true if it is within the cluster size of the center
          const distance = Math.sqrt(
            (x - centerX) ** 2 + (y - centerY) ** 2 + (z - centerZ) ** 2,
          );
          clusteredWorld[x][y][z] = distance < clusterSize;
        }
      }
    }

    return clusteredWorld;
  }
}
