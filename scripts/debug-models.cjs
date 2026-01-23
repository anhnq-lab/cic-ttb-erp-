
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyD2RRm6UyfqBE73VN9Oz2eEM_JgDbGn1Ic";

async function listModels() {
    console.log("Checking available models for your API Key...");

    try {
        // Note: List models isn't directly exposed in the high-level helper easily in all versions, 
        // but we can try a simple generation with a known safe model or just iterate.
        // actually checking the error message suggestion "Call ListModels"

        // We'll try to use the GenAI generic client if possible, but the SDK structure varies.
        // Let's try 'gemini-1.0-pro' which is often the robust fallback.

        const genAI = new GoogleGenerativeAI(API_KEY);

        // Array of potential model names to test
        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest",
            "gemini-1.0-pro",
            "gemini-pro"
        ];

        for (const modelName of candidates) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                const response = await result.response;
                console.log(`✅ SUCCESS with ${modelName}`);
                console.log(response.text());
                return; // Exit on first success
            } catch (e) {
                console.log(`❌ Failed ${modelName}: ${e.message.split('\n')[0]}`);
            }
        }

        console.log("All common model names failed.");

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
