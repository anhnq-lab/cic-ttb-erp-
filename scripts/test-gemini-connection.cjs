
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyD2RRm6UyfqBE73VN9Oz2eEM_JgDbGn1Ic";

async function testConnection() {
    console.log("Testing Gemini API Connection...");
    console.log("Key:", API_KEY.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Hello! Are you working?";
        console.log(`Sending prompt: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("---------------------------------------------------");
        console.log("SUCCESS! API Connection is working.");
        console.log("Response:", text);
        console.log("---------------------------------------------------");
    } catch (error) {
        console.error("---------------------------------------------------");
        console.error("ERROR: Failed to connect to Gemini API.");
        console.error("Error Details:", error.message);
        if (error.response) {
            console.error("Response Error:", error.response);
        }
        console.error("---------------------------------------------------");
    }
}

testConnection();
