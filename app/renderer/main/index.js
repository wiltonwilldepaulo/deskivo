import '../../../app/config/env.js';
import { app, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MainWindowFactory from './windows/MainWindowFactory.js';
import Connection from '../../database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

ipcMain.handle('database:get-time', async () => {
    let client;

    try {
        client = await Connection.connect();
        const result = await client.query('SELECT NOW() AS now');

        return {
            success: true,
            now: result.rows[0].now,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    } finally {
        if (client) {
            client.release();
        }
    }
});

async function bootstrap() {
    mainWindow = MainWindowFactory.createWindow();
    await mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(bootstrap);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', async () => {
    if (!mainWindow) {
        await bootstrap();
    }
});