// <button id="cadastroCliente">Cadastrar Cliente</button>
const registerCliente = document.getElementById("cadastroCliente");
// Verifica se o elemento foi encontrado antes de tentar usá-lo
// Isso evita erro caso o botão/link não exista na página
if (registerCliente) {
    // Adiciona um evento de clique ao elemento encontrado
    registerCliente.addEventListener("click", async (event) => {
        // Impede o comportamento padrão do elemento
        event.preventDefault();
        try {
            // Chama a API exposta pelo Electron no preload
            // para abrir a página "cliente.html"
            // O uso de "await" indica que a função é assíncrona
            // e o código espera a conclusão antes de continuar
            await window.electronAPI.openPage("cliente.html");
        } catch (error) {
            // Caso ocorra algum problema ao abrir a página,
            // o erro será exibido no console para facilitar o debug
            console.error("Erro ao abrir cliente.html:", error);
        }
    });
}