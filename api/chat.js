export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt manquant" });
  }

  try {
    // Changement pour le modèle 2.0 Flash (le plus performant dispo)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }]
      })
    });

    const data = await response.json();

    // Si Google renvoie une erreur (quota ou nom de modèle)
    if (data.error) {
      console.error("Erreur API Google:", data.error.message);
      return res.status(400).json({ error: data.error.message });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("Erreur Serveur:", error);
    res.status(500).json({ error: "Erreur de connexion serveur." });
  }
}