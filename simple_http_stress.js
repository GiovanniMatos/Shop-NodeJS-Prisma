const axios = require('axios');
const url = 'http://localhost';
const numRequests = 100; // requisições a serem enviadas
const threads = 10; // quantidade de threads para executar simultaneamente

async function sendRequests() {
    for (let i = 0; i < numRequests / threads; i++) {
        try {
            const response = await axios.get(url);
            console.log(`Response Code: ${response.status}`);
        } catch (error) {
            console.error(`Request failed: ${error.message}`);
        }
    }
}

const startTime = Date.now();
const promises = [];

for (let i = 0; i < threads; i++) {
    promises.push(sendRequests());
}

Promise.all(promises).then(() => {
    const endTime = Date.now();
    console.log(`Total time taken: ${(endTime - startTime) / 1000} seconds`);
});