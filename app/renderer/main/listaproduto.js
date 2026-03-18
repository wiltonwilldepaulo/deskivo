const table = new DataTable('#tabela-produto', {
    responsive: true,
    processing: true,
    serverSide: true,
    ajax: async (data, callback) => {
        const filter = {
            term: data?.search?.value,      //Termo da pesquisa
            limit: data?.length,            //Limite de resgistos a ser selecionado do banco
            offset: data?.start,            //A pesquinsa inicia no registro Ex: 5, 10
            orderType: data?.order[0]?.dir, //Tipo de ordenação 
            column: data?.order[0]?.column  //Coluna a ser filtrada
        }
        try {
            const response = await window.electronAPI.searchProducts(filter);
            callback({
                draw: response?.draw ?? data?.draw ?? 0,
                recordsTotal: response?.recordsTotal ?? 0,
                recordsFiltered: response?.recordsFiltered ?? 0,
                data: response?.data ?? []
            });
        } catch (error) {
            console.error(`Restrição: ${error.message}`);
            callback({
                draw: 0,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            });
        }
    },
    columns: [
        { data: 'id', title: 'Código' },
        { data: 'name', title: 'Nome' },
        { data: 'price', title: 'Preço de venda' }
    ]
});