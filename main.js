const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
    //Remove o menu da aplicação inteira (Windows/Linux)
    Menu.setApplicationMenu(null);
    const win = new BrowserWindow({
        width: 1000,
        height: 700
    });
    win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());