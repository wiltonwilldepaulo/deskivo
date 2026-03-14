import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BrowserWindow } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Template {
    create(view) {
        //Verifica se a janela informada existe, caso exista retorna a janela: index.html
        const isViewExists = (view === 'index.html') ? path.join() : path.join(__dirname, '..', 'view', 'html', 'index.html');
        if (this.window && !this.window.isDestroyed()) {
            return this.window;
        }

        this.window = new BrowserWindow({
            width: process.env,
            height: 800,
            show: false,
            autoHideMenuBar: true,
            webPreferences: {
                preload: path.join(__dirname, '../preload/index.js'),
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: true,
            },
        });

        this.window.loadFile(path.join(__dirname, '../view/html/index.html'));

        this.window.once('ready-to-show', () => {
            this.show();
        });

        this.window.on('closed', () => {
            this.window = null;
        });

        return this.window;
    }

    show() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.show();
        }
    }

    focus() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.focus();
        }
    }

    close() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.close();
        }
    }
}