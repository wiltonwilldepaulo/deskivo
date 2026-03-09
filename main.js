// Importa do Electron os módulos principais da aplicação:
// app controla o ciclo de vida da aplicação,
// BrowserWindow cria janelas nativas,
// Menu controla o menu da aplicação,
// ipcMain recebe mensagens vindas do renderer/preload.
const { app, BrowserWindow, Menu, ipcMain } = require("electron");

// Importa o módulo nativo path do Node.js para montar caminhos de arquivos.
const path = require("path");

// Declara uma função chamada createWindow que recebe o nome da página a ser carregada.
function createWindow(view) {
    // Remove o menu padrão da aplicação.
    Menu.setApplicationMenu(null);
    // Cria uma nova janela do Electron e guarda a referência na constante win.
    const win = new BrowserWindow({
        // Define a largura inicial da janela.
        width: 1000,
        // Define a altura inicial da janela.
        height: 700,
        // Define preferências de comportamento e segurança da parte web da janela.
        webPreferences: {
            // Informa o caminho do arquivo preload.js que será carregado antes da página.
            preload: path.join(__dirname, "preload.js"),
            // Isola o contexto da página do contexto interno do Electron por segurança.
            contextIsolation: true,
            // Desativa o acesso direto ao Node.js dentro da página HTML.
            nodeIntegration: false,
            // Ativa sandbox para reforçar o isolamento e a segurança.
            sandbox: true,
        },
    });
    // Carrega na janela o arquivo HTML informado no parâmetro view.
    win.loadFile(path.join(__dirname, view));
    // Retorna a referência da janela criada.
    return win;
}

// Aguarda o Electron terminar a inicialização para então executar o código abaixo.
app.whenReady().then(() => {
    // Cria a janela principal carregando o arquivo index.html.
    createWindow("index.html");
    // Registra um handler IPC para escutar chamadas no canal "window:open-page".
    ipcMain.handle("window:open-page", async (_event, pageName) => {
        // Cria uma nova janela carregando o arquivo recebido em pageName.
        createWindow(pageName);
        // Retorna um objeto simples informando que a operação foi executada.
        return { ok: true };
    });
});

// Escuta o evento disparado quando todas as janelas da aplicação forem fechadas.
app.on("window-all-closed", () => {
    // Verifica se o sistema operacional não é macOS.
    if (process.platform !== "darwin") {
        // Encerra completamente a aplicação.
        app.quit();
    }
});