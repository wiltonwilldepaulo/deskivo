import { BrowserWindow, app } from 'electron';

import path from 'path';

import fs from 'fs';

import { fileURLToPath } from 'url';

import nunjucks from 'nunjucks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_PROD = process.env.APP_ENV !== 'development';
const APP_DIR = path.join(__dirname, '..');
const VIEW_DIR = path.join(APP_DIR, 'view');
const PRELOAD_PATH = path.join(APP_DIR, 'config', 'preload.js');
const TEMP_DIR = path.join(app.getPath('temp'), 'deskivo-views');

// ── Configura Nunjucks ──────────────
const nunjucksEnv = nunjucks.configure(VIEW_DIR, {
    autoescape: true,
    noCache: !IS_PROD,
});

// ── Variáveis globais (disponíveis em TODOS os templates) ──
const MODULES_PATH = path.join(APP_DIR, '..', 'node_modules').replace(/\\/g, '/');
const ASSETS_PATH = path.join(VIEW_DIR, 'pages', 'assets').replace(/\\/g, '/');

nunjucksEnv.addGlobal('assets', ASSETS_PATH);
nunjucksEnv.addGlobal('modules', MODULES_PATH);
nunjucksEnv.addGlobal('appName', 'DESKIVO');
nunjucksEnv.addGlobal('isProd', IS_PROD);

// ── Cria pasta temp para HTMLs compilados ──
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

class Template {

    static #windows = new Map();

    static #defaults = {
        width: 1024,
        height: 680,
        minWidth: 480,
        minHeight: 360,
        show: false,
        center: true,
        backgroundColor: '#0f1318',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            devTools: !IS_PROD,
            preload: PRELOAD_PATH,
        }
    };

    // Método estático que cria e registra uma nova janela pelo nome    
    static create(name, options = {}) {
        // Verifica se já existe uma janela registrada com este nome
        if (Template.#windows.has(name)) {
            // Obtém a janela existente do registro
            const existing = Template.#windows.get(name);
            // Verifica se a janela ainda está ativa e não foi destruída
            if (!existing.isDestroyed()) {
                // Traz a janela existente para o foco ao invés de criar uma nova
                existing.focus();
                // Retorna a janela já existente encerrando o método
                return existing;
            }
            // Remove do registro caso a janela existente esteja destruída
            Template.#windows.delete(name);
        }
        // Mescla as opções recebidas com as configurações padrão da classe
        const config = Template.#merge(options);
        // Cria uma nova janela do Electron com as configurações mescladas
        const win = new BrowserWindow(config);
        // Registra a nova janela no Map usando o nome como chave
        Template.#windows.set(name, win);
        // Aguarda a janela estar pronta para ser exibida antes de mostrá-la
        win.once('ready-to-show', () => {
            // Exibe a janela assim que estiver completamente carregada
            win.show();
            // Verifica se está fora do ambiente de produção
            if (!IS_PROD) {
                // Abre o DevTools em uma janela separada para fins de depuração
                win.webContents.openDevTools({ mode: 'detach' });
            }
        });
        // Escuta o evento de fechamento da janela para limpar o registro
        win.on('closed', () => Template.#windows.delete(name));
        // Retorna a janela recém-criada para quem chamou o método
        return win;
    }

    // Método estático que renderiza e carrega um template HTML em uma janela
    static loadView(win, viewName, data = {}) {
        // Renderiza o template nunjucks com os dados recebidos, gerando o HTML final
        const html = nunjucksEnv.render(`${viewName}.html`, data);
        // Substitui barras "/" por hífens "-" para evitar conflitos no caminho do arquivo
        const safeName = viewName.replace(/\//g, '-');
        // Monta o caminho completo do arquivo temporário onde o HTML será salvo
        const tempFile = path.join(TEMP_DIR, `${safeName}.html`);
        // Salva o HTML gerado como arquivo temporário em disco, codificado em UTF-8
        fs.writeFileSync(tempFile, html, 'utf8');
        // Carrega o arquivo temporário na janela do Electron para exibição
        win.loadFile(tempFile);
    }

    // Método estático que busca e retorna uma janela ativa pelo nome
    static get(name) {
        // Busca a janela registrada no Map usando o nome como chave
        const win = Template.#windows.get(name);
        // Verifica se a janela existe e ainda não foi destruída, retornando-a caso esteja ativa
        if (win && !win.isDestroyed()) return win;
        // Remove do registro caso a janela exista mas esteja destruída
        Template.#windows.delete(name);
        // Retorna null indicando que nenhuma janela válida foi encontrada
        return null;
    }

    // Método estático responsável por fechar uma janela pelo nome
    static close(name) {
        // Busca a janela pelo nome, retornando null se não existir ou estiver destruída
        const win = Template.get(name);
        // Fecha a janela apenas se ela existir e estiver ativa
        if (win) win.close();
    }

    // Método privado que mescla as opções recebidas com as configurações padrão
    static #merge(options) {
        // Combina os padrões com as opções recebidas, priorizando as opções do chamador
        const merged = { ...Template.#defaults, ...options };
        // Mescla separadamente o webPreferences para não sobrescrever suas propriedades internas
        merged.webPreferences = {
            // Spread das preferências padrão como base
            ...Template.#defaults.webPreferences,
            // Sobrescreve apenas as preferências informadas, usando objeto vazio se não houver nenhuma
            ...(options.webPreferences || {}),
        };
        // Retorna o objeto final com todas as configurações mescladas
        return merged;
    }

    constructor() {
        throw new Error('Template é estática. Use Template.create()');
    }
}

export default Template;