export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, pdfBase64 } = req.body; // 🛠 also fix the key name here
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not set on the server.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // ✅ Safely extract Gemini response text
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.status(200).json({ text: resultText });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
