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
            }
        });
        
        if (process.env.APP_ENV === 'development') {
            // Abre automaticamente o DevTools (console do desenvolvedor) junto com a janela
            mainWindow.webContents.openDevTools();
        }
        // Registra um handler IPC que escuta o evento 'window:open-page' disparado pelo renderer via ipcRenderer.invoke
        ipcMain.handle('window:open-page', async (_event, pageName) => {
            // Carrega o arquivo HTML correspondente ao nome da página recebida, dentro do diretório PAGES_DIR
            await mainWindow.loadFile(path.join(PAGES_DIR, pageName));
        });
        // Registra um handler IPC que escuta o evento 'window:save-product' 
        // disparado pelo renderer para salvar dados de produto
        ipcMain.handle('product:save', async (_event, productData) => {
            return await ProductRepository.insert(productData);
        });

        // Carrega o arquivo index.html na janela assim que ela é criada, exibindo a tela inicial
        mainWindow.loadFile(path.join(PAGES_DIR, 'index.html'));
        // Retorna a instância da janela criada para que possa ser referenciada em outros lugares da aplicação
        return mainWindow;
    }
}