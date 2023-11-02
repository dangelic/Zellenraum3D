const { contextBridge, ipcRenderer } = require("electron");

/**
 * Expose IPC (Inter-Process Communication) functions to the renderer process.
 *
 * @namespace electron
 */
contextBridge.exposeInMainWorld("electron", {
    /**
     * Send a message to the main process.
     *
     * @param {string} channel - The channel to send the message on.
     * @param {any} data - The data to send with the message.
     */
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },

    /**
     * Receive a message from the main process.
     *
     * @param {string} channel - The channel to listen for messages on.
     * @param {Function} func - The callback function to handle received messages.
     */
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
});