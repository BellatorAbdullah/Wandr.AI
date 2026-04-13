require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Allows the server to read the data you send

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The Route (The "Phone Line" React calls)
app.post('/api/generate-itinerary', async (req, res) => {
    try {
        const { answers } = req.body;

        // Create a prompt from the answers
        const prompt = `Plan a trip based on these details: ${JSON.stringify(answers)}. Please provide a detailed itinerary in Markdown format.`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ itinerary: responseText });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "AI generation failed." });
    }
});

const PORT = 8080; 

app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});
