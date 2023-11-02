import { app, BrowserWindow } from "electron";
import * as path from "path";


/**
 * ** The main window of the Electron application "Zellenraum3D".
 * 
 * Zellenraum3D is a captivating 3D visualization of cellular automata, powered by the THREE.js library.
 * It provides a dynamic and interactive representation of evolving cellular structures.
 * 
 * From here on: Go to renderer.ts where the call-chain starts.
 */

/**
 
 *
 * @type {BrowserWindow | null}
 */
let mainWindow: BrowserWindow | null;

/**
 * Create the main application window.
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 1000,
        webPreferences: {
            nodeIntegration: true, // Allow Node.js integration in the renderer process
            contextIsolation: false, // Disable context isolation for simpler integration
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // Load the HTML file into the main window
    mainWindow.loadFile(path.join(__dirname, "..", "index.html"));

    // Set the main window to fullscreen mode
    mainWindow.setFullScreen(true);

    // Handle the "closed" event of the main window
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// Create the main window when the Electron app is ready
app.on("ready", createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// Create a new window when the app is activated (on macOS)
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});