export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // ✅ GEMINI-PRO : Le seul modèle 100% compatible avec toutes les clés API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Erreur Google:", data.error.message);
      return res.status(400).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Problème de connexion serveur." });
  }
}