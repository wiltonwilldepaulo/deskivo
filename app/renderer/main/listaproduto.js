const voltarButton = document.getElementById('voltar-button');
const cadastroButton = document.getElementById('cadastro-button');

voltarButton.addEventListener('click', async () => {
    try {
        if (!window.electronAPI || typeof window.electronAPI.openPage !== 'function') {
            throw new Error('API do Electron não foi injetada pelo preload');
        }
        await window.electronAPI.goHome();
    } catch (error) {
        console.error('Erro ao abrir a janela principal:', error);
    }
});

cadastroButton.addEventListener('click', async () => {
    try {
        if (!window.electronAPI || typeof window.electronAPI.openPage !== 'function') {
            throw new Error('API do Electron não foi injetada pelo preload');
        }
        await window.electronAPI.openPage('produto.html');
    } catch (error) {
        console.error('Erro ao abrir a janela de cadastro de produtos:', error);
    }
});