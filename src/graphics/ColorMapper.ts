export class ColorMapper {
    public static mapPositionToColor(currentGenerationStates: string[][][], x, y, z) {
        // Calculate the center of the world
        const centerX = Math.floor(currentGenerationStates.length / 2);
        const centerY = Math.floor(currentGenerationStates.length / 2);
        const centerZ = Math.floor(currentGenerationStates.length / 2);

        // Calculate the distance from the center
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2 + (z - centerZ) ** 2);

        // Define cloud-like color possibilities
        const colors = ['yellow1', 'yellow2', 'orange1', 'orange2', 'red1', 'red2'];

        // Map the distance to a color
        const colorIndex = Math.floor(
            (distance / Math.max(centerX, centerY, centerZ)) * colors.length,
        );

        // Ensure the colorIndex is within bounds
        const index = Math.min(colors.length - 1, Math.max(0, colorIndex));

        // Return the RGB color
        return this.getColorRGB(colors[index]);
    }

    public static get5StateColor(currentGenerationStates: string[][][], x, y, z) {
        const colors = ['yellow1', 'orange1', 'orange2', 'red1', 'red2'];

        // Generate a random index to select a color
        const state = currentGenerationStates[x][y][z];
        let index;
        switch (state) {
            case 'STATE_0':
                index = 0;
                break;
            case 'STATE_1':
                index = 1;
                break;
            case 'STATE_2':
                index = 2;
                break;
            case 'STATE_3':
                index = 3;
                break;
            case 'STATE_4':
                index = 4;
                break;
        }

        // Return the RGB color for the randomly selected color
        return this.getColorRGB(colors[index]);
    }

    public static getRandomColor() {
        const colors = ['yellow1', 'yellow2', 'yellow3', 'orange1', 'orange2', 'red1', 'red2'];

        // Generate a random index to select a color
        const randomIndex = Math.floor(Math.random() * colors.length);

        // Return the RGB color for the randomly selected color
        return this.getColorRGB(colors[randomIndex]);
    }

    private static getColorRGB(color) {
        // Map color names to RGB values
        const colorMap = {
            red: [255, 0, 0],
            lighterblue: [173, 216, 250], // Slightly lighter blue
            gray: [169, 169, 169],
            darkblue: [0, 0, 139],
            lightblue: [173, 216, 230],
            lightcyan: [224, 255, 255],
            orange: [255, 165, 0],

            yellow1: [255, 255, 0], // Yellow
            yellow2: [255, 230, 0], // Slightly lighter yellow
            yellow3: [255, 204, 0],
            orange1: [255, 153, 0], // Orange
            orange2: [255, 128, 0],
            red1: [255, 77, 77], // Light Red
            red2: [255, 0, 0], // Red
        };

        return `rgb(${colorMap[color][0]}, ${colorMap[color][1]}, ${colorMap[color][2]})`;
    }
}
