
const https = require('https');

// Key provided by user
const API_KEY = "AIzaSyD2RRm6UyfqBE73VN9Oz2eEM_JgDbGn1Ic";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Checking API Key by listing models via direct REST call...");

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("---------------------------------------------------");
        console.log("HTTP Status Code:", res.statusCode);

        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("✅ API Key is Valid! Available models:");
                json.models.forEach(m => console.log(" - " + m.name));
            } else {
                console.log("❌ API Response Error:", JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log("Raw Response:", data);
        }
        console.log("---------------------------------------------------");
    });
}).on("error", (err) => {
    console.log("Connection Error: " + err.message);
});
