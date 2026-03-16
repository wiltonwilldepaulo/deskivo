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

$(document).ready(function () {

    $('#table-products').DataTable({

        language: {
            loadingRecords: 'Carregando...',
            zeroRecords: 'Nenhum produto encontrado.',
            emptyTable: 'Nenhum dado disponível.',
            processing: 'Processando...',
        },

        serverSide: true,
        processing: true,

        ajax: async (dtParams, callback) => {
            try {
                const result = await window.electronAPI.searchProducts({
                    draw: dtParams.draw,
                    start: dtParams.start,
                    length: dtParams.length,
                    search: dtParams.search.value,
                });

                callback(result);

            } catch (error) {
                console.error('[listaproduto] Erro ao buscar dados:', error.message);

                callback({
                    draw: drawCounter,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: [],
                });
            }
        },

        columns: [
            { data: 'id', title: 'ID' },
            { data: 'name', title: 'Nome' },
            { data: 'price', title: 'Preço' }
        ],

        pageLength: 10,
        ordering: true,
        searching: true,
    });

});