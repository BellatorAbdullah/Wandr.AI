require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const Groq    = require('groq-sdk');

const app  = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

console.log("CHECK: Groq key:", process.env.GROQ_API_KEY ? "OK" : "MISSING");
console.log("CHECK: Unsplash key:", process.env.UNSPLASH_ACCESS_KEY ? "OK" : "MISSING");

// Fetch a real photo from Unsplash — retries with simpler queries if needed
async function fetchUnsplashPhoto(query) {
  const attempts = [
    query.split(' ').slice(0, 3).join(' '), // first 3 words e.g. "Batu Caves Kuala"
    query.split(' ')[0],                     // just first word e.g. "Batu"
    "travel",                                // always works
  ];

  for (const q of attempts) {
    try {
      const url  = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(q)}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data && data.urls && data.urls.regular) {
        console.log('Unsplash OK for:', q);
        return data.urls.regular;
      }
    } catch (err) {
      console.error('Unsplash error for:', q, err.message);
    }
  }

  // Absolute fallback - picsum always returns something
  const seed = query.split(' ')[0];
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/400`;
}

app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const { answers } = req.body;

    const prompt = `You are an expert travel planner with deep knowledge of real restaurants, hotels, and attractions worldwide.

Plan a detailed travel itinerary based on these user preferences:
${JSON.stringify(answers, null, 2)}

### STRICT RULES:
1. Always use REAL, specific restaurant names (e.g. "Violet Oon Singapore" not "a local restaurant").
2. Always use REAL, specific attraction names and their actual neighbourhoods.
3. Food recommendations must name the ACTUAL restaurant and a specific dish they serve.
4. Be specific and exciting — this is someone's real trip.

### STRICT RULES:
1. Always use REAL, specific restaurant names (e.g. "Violet Oon Singapore" not "a local restaurant").
2. Always use REAL, specific attraction names and their actual neighbourhoods.
3. Food recommendations must name the ACTUAL restaurant and a specific dish they serve.
4. Always recommend a REAL hotel to stay at that matches the user's budget and accommodation preference — include it on Day 1 as the check-in activity with the actual hotel name and area.
5. Be specific and exciting — this is someone's real trip.

Examples of correct image placeholders:
[PHOTO: Batu Caves Kuala Lumpur]
[PHOTO: Jalan Alor Street Food]
[PHOTO: Petronas Twin Towers night]
[PHOTO: Bukit Bintang shopping]
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional travel planner with encyclopedic knowledge of real restaurants, attractions, and local experiences worldwide. Always name specific real places, never generic descriptions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    });

    let itineraryText = completion.choices[0].message.content;

    // Find all [PHOTO: ...] placeholders
    const photoRegex = /\[PHOTO:\s*(.+?)\]/g;
    const matches    = [...itineraryText.matchAll(photoRegex)];

    // Fetch all Unsplash photos in parallel
    const photoMap = {};
    await Promise.all(
      matches.map(async (match) => {
        const query    = match[1].trim();
        const photoUrl = await fetchUnsplashPhoto(query);
        photoMap[match[0]] = `![${query}](${photoUrl})`;
      })
    );

    // Replace placeholders with real image markdown
    for (const [placeholder, imgMarkdown] of Object.entries(photoMap)) {
      itineraryText = itineraryText.replace(placeholder, imgMarkdown);
    }

    // Add a real hero image at the top for the destination
    const heroUrl = await fetchUnsplashPhoto(answers.destination);
    itineraryText = `![${answers.destination}](${heroUrl})\n\n` + itineraryText;

    res.json({ itinerary: itineraryText });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "AI generation failed. Check backend console." });
  }
});

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});