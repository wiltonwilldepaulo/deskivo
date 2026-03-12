const currentTime = document.getElementById('data_atual');
currentTime.innerHTML = `Loading...`;

async function fetchCurrentTime() {
    try {
        const response = await window.electronAPI.getDatabaseTime();

        if (!response?.success) {
            throw new Error(response?.message || 'Erro ao consultar banco');
        }

        currentTime.textContent = `Current time from database: ${response.now}`;
    } catch (error) {
        currentTime.innerHTML = `Error: ${error.message}`;
    } finally {
        currentTime.innerHTML = `Current Time: ${new Date().toLocaleTimeString()}`;
    }
}

await fetchCurrentTime();


setInterval(await fetchCurrentTime, 1000);