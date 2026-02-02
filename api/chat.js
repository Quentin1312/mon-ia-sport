export default async function handler(req, res) {
  // On récupère la question du sport envoyée par le HTML
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // On renvoie la réponse de l'IA à ton site
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: "L'IA a eu un problème technique." });
  }
}