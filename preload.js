// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    openPage: (pageName) => ipcRenderer.invoke("window:open-page", pageName)
});