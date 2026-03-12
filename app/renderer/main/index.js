import '../../config/env.js';
import { app } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MainWindowFactory from './windows/MainWindowFactory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

async function bootstrap() {
    mainWindow = MainWindowFactory.createWindow();
}

app.whenReady().then(bootstrap);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', async () => {
    if (!mainWindow) await bootstrap();
});