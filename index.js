// index.js
const registerCliente = document.getElementById("cadastroCliente");

if (registerCliente) {
    registerCliente.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            await window.electronAPI.openPage("cliente.html");
        } catch (error) {
            console.error("Erro ao abrir cliente.html:", error);
        }
    });
}