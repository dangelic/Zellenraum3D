import { GenerationStatesMatrix, CellVisibilityMatrix } from "../types/Types";

/**
 * Utility class for mapping cell positions to colors in a cellular automaton.
 */
export class ColorMapper {
    /**
     * Maps the position of a cell to a color based on distance from the center.
     *
     * @param currentGenerationStates - The current generation state of the cellular automaton.
     * @param x - The x-coordinate of the cell.
     * @param y - The y-coordinate of the cell.
     * @param z - The z-coordinate of the cell.
     * @returns The RGB color representation.
     */
    public static mapPositionToColor(
        currentGenerationStates: GenerationStatesMatrix,
        x: number,
        y: number,
        z: number,
    ) {
        // Calculate the center of the world
        const centerX = Math.floor(currentGenerationStates.length / 2);
        const centerY = Math.floor(currentGenerationStates.length / 2);
        const centerZ = Math.floor(currentGenerationStates.length / 2);

        // Calculate the distance from the center
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2 + (z - centerZ) ** 2);

        // Define cloud-like color possibilities
        const colors = ["yellow1", "yellow2", "orange1", "orange2", "red1", "red2"];

        // Map the distance to a color
        const colorIndex = Math.floor(
            (distance / Math.max(centerX, centerY, centerZ)) * colors.length,
        );

        // Ensure the colorIndex is within bounds
        const index = Math.min(colors.length - 1, Math.max(0, colorIndex));

        // Return the RGB color
        return this.getColorRGB(colors[index]);
    }

    /**
     * Maps a 5-state cell to a color based on its state (e.g. for 445-Rule)
     *
     * @param currentGenerationStates - The current generation state of the cellular automaton.
     * @param x - The x-coordinate of the cell.
     * @param y - The y-coordinate of the cell.
     * @param z - The z-coordinate of the cell.
     * @returns The RGB color representation.
     */
    public static get5StateColor(
        currentGenerationStates: GenerationStatesMatrix,
        x: number,
        y: number,
        z: number,
    ) {
        const colors = ["corral", "hotpink", "orange", "orangered", "red", "darkred", "crimson"];

        // Generate a random index to select a color
        const stateString = currentGenerationStates[x][y][z];
        const state = parseInt(stateString.match(/\d+/)[0]);
        const index = state;

        // Return the RGB color for the randomly selected color
        return this.getColorRGB(colors[index]);
    }

    /**
     * Generates a random color from a predefined set of colors.
     *
     * @returns The RGB color representation.
     */
    public static getRandomColor() {
        const colors = ["yellow1", "yellow2", "orange", "orangered", "red", "darkred", "crimson"];

        // Generate a random index to select a color
        const randomIndex = Math.floor(Math.random() * colors.length);

        // Return the RGB color for the randomly selected color
        return this.getColorRGB(colors[randomIndex]);
    }

    /**
     * Converts a color name to its RGB representation.
     *
     * @param color - The name of the color.
     * @returns The RGB color representation.
     */
    private static getColorRGB(color) {
        // Map color names to RGB values
        const colorMap = {
            // Red and Pink Tones
            red: [255, 0, 0],
            darkred: [139, 0, 0],
            crimson: [220, 20, 60],
            deeppink: [255, 20, 147],
            lightcoral: [240, 128, 128],
            pink: [255, 182, 193],
            palevioletred: [219, 112, 147],
            hotpink: [255, 105, 180],
            mediumvioletred: [199, 21, 133],
            rosybrown: [188, 143, 143],
            salmon: [250, 128, 114],
            lightsalmon: [255, 160, 122],
            mistyrose: [255, 228, 225],
            peachpuff: [255, 218, 185],
            papayawhip: [255, 239, 213],
            lavenderblush: [255, 240, 245],

            // Orange and Yellow Tones
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            darkorange: [255, 140, 0],
            goldenrod: [218, 165, 32],
            gold: [255, 215, 0],
            yellow1: [255, 255, 0], // Yellow
            yellow2: [255, 230, 0], // Slightly lighter yellow
            yellow3: [255, 204, 0],
            yellow: [255, 255, 0],
            khaki: [240, 230, 140],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],

            // Brown and Maroon Tones
            brown: [165, 42, 42],
            saddlebrown: [139, 69, 19],
            peru: [205, 133, 63],
            sienna: [160, 82, 45],
            burlywood: [222, 184, 135],
            chocolate: [210, 105, 30],
            sandybrown: [244, 164, 96],

            // Green Tones
            green: [0, 128, 0],
            darkgreen: [0, 100, 0],
            seagreen: [46, 139, 87],
            mediumseagreen: [60, 179, 113],
            lightseagreen: [32, 178, 170],
            forestgreen: [34, 139, 34],
            greenyellow: [173, 255, 47],
            lawngreen: [124, 252, 0],
            chartreuse: [127, 255, 0],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            mediumaquamarine: [102, 205, 170],
            aquamarine: [127, 255, 212],
            springgreen: [0, 255, 127],
            mediumspringgreen: [0, 250, 154],

            // Blue Tones
            blue: [0, 0, 255],
            darkblue: [0, 0, 139],
            mediumblue: [0, 0, 205],
            midnightblue: [25, 25, 112],
            navy: [0, 0, 128],
            blueviolet: [138, 43, 226],
            darkslateblue: [72, 61, 139],
            slateblue: [106, 90, 205],
            mediumslateblue: [123, 104, 238],
            cornflowerblue: [100, 149, 237],
            royalblue: [65, 105, 225],
            dodgerblue: [30, 144, 255],
            steelblue: [70, 130, 180],
            lightskyblue: [135, 206, 250],
            skyblue: [135, 206, 235],
            lightblue: [173, 216, 230],
            lightcyan: [224, 255, 255],

            // Purple Tones
            purple: [128, 0, 128],
            mediumpurple: [147, 112, 219],
            darkslategray: [47, 79, 79],
            slategray: [112, 128, 144],
            lightgray: [211, 211, 211],
            darkgray: [169, 169, 169],
            gray: [128, 128, 128],

            // White and Black Tones
            white: [255, 255, 255],
            black: [0, 0, 0],

            // More Colors
            thistle: [216, 191, 216],
            lavender: [230, 230, 250],
            plum: [221, 160, 221],
            violet: [238, 130, 238],
            indigo: [75, 0, 130],
            gainsboro: [220, 220, 220],
        };
        return `rgb(${colorMap[color][0]}, ${colorMap[color][1]}, ${colorMap[color][2]})`;
    }
}
