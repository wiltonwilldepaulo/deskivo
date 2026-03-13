const saveButton = document.getElementById('save-button');

saveButton.addEventListener('click', async () => {
    const data = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
    };

    try {
        const result = await window.electronAPI.saveProduct(data);
        console.log('Produto salvo com sucesso:', result);
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
    }
});