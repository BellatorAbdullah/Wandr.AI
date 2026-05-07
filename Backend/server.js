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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Plan a detailed "Buddymoon" trip based on these details: ${JSON.stringify(answers)}.

    ### STRICT FORMATTING RULES:
    1. **Header Image**: Start with: ![Destination](https://loremflickr.com/800/400/${answers.destination},landscape)
    2. **Summary Table**: Create a Markdown table with: Destination | Duration | Vibe | Budget Range.
    3. **Daily Itinerary**: For EVERY day, use a Header (e.g., Day 1: Name) and a Markdown Table with columns: [Time | Activity | Location | Vibe].
    4. **Visuals**: Between each day, include one image: ![Activity](https://loremflickr.com/800/400/${answers.destination},landmark)
    5. **Food**: Use blockquotes (>) for food recommendations and include: ![Food](https://loremflickr.com/800/400/${answers.destination},food)
`;

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
