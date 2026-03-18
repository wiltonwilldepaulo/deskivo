import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// ── ESM não tem __dirname — recriamos ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_PROD = process.env.NODE_ENV === 'production';
const APP_DIR = path.join(__dirname, '..');
const VIEW_DIR = path.join(APP_DIR, 'view', 'pages');
const PRELOAD_PATH = path.join(APP_DIR, 'config', 'preload.js');

class Template {

    static #windows = new Map();

    static #defaults = {
        width: 1024,
        height: 680,
        minWidth: 480,
        minHeight: 360,
        show: false,
        center: true,
        //backgroundColor: '#0f1318',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            devTools: !IS_PROD,
            preload: PRELOAD_PATH,
        },
    };

    static create(name, options = {}) {
        if (Template.#windows.has(name)) {
            const existing = Template.#windows.get(name);
            if (!existing.isDestroyed()) {
                existing.focus();
                return existing;
            }
            Template.#windows.delete(name);
        }

        const config = Template.#merge(options);
        const win = new BrowserWindow(config);

        Template.#windows.set(name, win);

        win.once('ready-to-show', () => {
            win.show();
        });

        win.on('closed', () => {
            Template.#windows.delete(name);
        });

        return win;
    }

    static loadView(win, viewName) {
        const filePath = path.join(VIEW_DIR, `${viewName}.html`);
        win.loadFile(filePath);
    }

    static get(name) {
        const win = Template.#windows.get(name);
        if (win && !win.isDestroyed()) return win;
        Template.#windows.delete(name);
        return null;
    }

    static close(name) {
        const win = Template.get(name);
        if (win) win.close();
    }

    static #merge(options) {
        const merged = { ...Template.#defaults, ...options };
        merged.webPreferences = {
            ...Template.#defaults.webPreferences,
            ...(options.webPreferences || {}),
        };
        return merged;
    }

    constructor() {
        throw new Error('Template é estática. Use Template.create()');
    }
}

export default Template;