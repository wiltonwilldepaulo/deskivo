const productButton = document.getElementById('product-button');

productButton.addEventListener('click', async () => {
    try {
        if (!window.electronAPI || typeof window.electronAPI.openPage !== 'function') {
            throw new Error('API do Electron não foi injetada pelo preload');
        }
        await window.electronAPI.openPage('listaproduto.html');
    } catch (error) {
        console.error('Erro ao abrir a janela de produtos:', error);
    }
});