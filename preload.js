// Indica que este é o arquivo preload.js, responsável por fazer a ponte segura 
// entre a interface e o processo principal.
const { contextBridge, ipcRenderer } = require("electron");

// Usa o contextBridge para expor um objeto chamado electronAPI dentro do window da página.
contextBridge.exposeInMainWorld("electronAPI", {
    // Cria uma função chamada openPage que recebe o nome da página e envia esse
    //  valor para o processo principal pelo canal "window:open-page".
    openPage: (pageName) => ipcRenderer.invoke("window:open-page", pageName)
});

