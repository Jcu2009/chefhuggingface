// --- START OF FILE server.js ---

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// These two lines are needed to get the current folder path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point to the .env inside the server folder
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("Checking Key:", process.env.GOOGLE_API_KEY ? "Success!" : "Still missing");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.post("/api/recipe", async (req, res) => {
  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Server is missing the Google API Key." });
  }


  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Ingredients must be an array" });
    }

    const ingredientsString = ingredients.join(", ");
    
    const prompt = `
      You are a recipe assistant. Create a simple recipe using the following ingredients: ${ingredientsString}.
      Add 1-2 common household ingredients like oil, salt, or pepper if needed.
      Format the response clearly using a markdown format with a title, ingredients list, and instructions.
    `;

    // **THE FIX: Switched to the ONLY OTHER available model from your list.**
    // The previous model had a free tier limit of 0 requests. This is the last alternative.
    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-robotics-er-1.5-preview:generateContent?key=${process.env.GOOGLE_API_KEY}`;

    const response = await fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Google API Error (Status: ${response.status}):`, errorData);
      return res.status(response.status).json({ error: `Google API error: ${errorData.error.message}` });
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error("Google API returned an empty or invalid response:", data);
      return res.status(500).json({ error: "API returned an empty response." });
    }

    const recipe = data.candidates[0].content.parts[0].text;
    res.json({ recipe });

  } catch (err) {
    console.error("A server-level error occurred:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Backend server running on http://localhost:3001");
});
export default app;