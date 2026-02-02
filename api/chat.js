export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis." });
  }

  try {
    // Utilisation du modèle gemini-2.5-flash pour un quota de 1500 req/jour
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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

    // Gestion des erreurs renvoyées par l'API Google
    if (data.error) {
      console.error("Erreur API Google:", data.error.message);
      return res.status(400).json({ error: data.error.message });
    }

    // Renvoi de la réponse réussie au client
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur technique serveur:", error);
    res.status(500).json({ error: "Problème de connexion avec le serveur." });
  }
}