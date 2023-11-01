export class ColorMapper {
  public static mapPositionToColor(world, x, y, z) {
    // Calculate the center of the world
    const centerX = Math.floor(world.length / 2);
    const centerY = Math.floor(world[0].length / 2);
    const centerZ = Math.floor(world[0][0].length / 2);

    // Calculate the distance from the center
    const distance = Math.sqrt(
      (x - centerX) ** 2 + (y - centerY) ** 2 + (z - centerZ) ** 2
    );

    // Define cloud-like color possibilities
    const colors = ['white', 'lighterblue', 'gray', 'darkblue', 'lightblue', 'lightcyan'];

    // Map the distance to a color
    const colorIndex = Math.floor((distance / Math.max(centerX, centerY, centerZ)) * colors.length);

    // Ensure the colorIndex is within bounds
    const index = Math.min(colors.length - 1, Math.max(0, colorIndex));

    // Return the RGB color
    return this.getColorRGB(colors[index]);
  }

  private static getColorRGB(color) {
    // Map color names to RGB values
    const colorMap = {
      white: [255, 255, 255],
      lighterblue: [173, 216, 250], // Slightly lighter blue
      gray: [169, 169, 169],
      darkblue: [0, 0, 139],
      lightblue: [173, 216, 230],
      lightcyan: [224, 255, 255],
    };

    return `rgb(${colorMap[color][0]}, ${colorMap[color][1]}, ${colorMap[color][2]})`;
  }
}