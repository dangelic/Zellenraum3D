export class Seed {
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
}
