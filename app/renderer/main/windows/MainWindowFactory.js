import { BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class MainWindowFactory {
    static createWindow() {
        Menu.setApplicationMenu(null);
        const mainWindow = new BrowserWindow({
            width: process.env.APP_WIDTH || 50,
            height: process.env.APP_HEIGHT || 10,
            webPreferences: {
                preload: path.join(__dirname, '..', '..', '..', 'preload', 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });
        mainWindow.webContents.openDevTools();
        if (process.env.APP_ENV === 'development') {
        }

        return mainWindow;
    }
}