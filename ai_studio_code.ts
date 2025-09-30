// This code runs on the SERVER, not the browser.
import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Your API_KEY is securely accessed from server environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const { product, audience, theme } = req.body;

  try {
    // Your existing generation logic from geminiService.ts goes here
    const prompt = `... create prompt based on product, audience, theme ...`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { /* ... your schema ... */ }
    });
    
    // Send the successful response back to the frontend
    res.status(200).json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
}