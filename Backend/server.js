require('dotenv').config();
console.log("CHECK: Server is using key:", process.env.GEMINI_API_KEY); // Add this!
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-itinerary', async (req, res) => {
    try {
        const { answers } = req.body;
        
        // THE FIX: Using the rock-solid "gemini-pro" model
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `Plan a trip based on these details: ${JSON.stringify(answers)}. Provide a detailed itinerary in Markdown format.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ itinerary: responseText });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI generation failed. Check backend console." });
    }
});

// Port 8080 works best on Mac
const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});