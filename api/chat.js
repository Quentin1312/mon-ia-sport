export default async function handler(req, res) {
  // 1. On récupère la question de l'utilisateur
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // 2. On utilise gemini-2.0-flash qui est très stable et rapide
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

    // 3. Gestion des erreurs de quota ou de clé API
    if (data.error) {
      console.error("Erreur Google:", data.error.message);
      return res.status(400).json({ 
        error: "Limite atteinte ou erreur API. Réessayez dans 1 minute." 
      });
    }

    // 4. On renvoie la réponse à ton fichier index.html
    res.status(200).json(data);

  } catch (error) {
    console.error("Erreur Serveur:", error);
    res.status(500).json({ error: "Problème de connexion avec l'IA." });
  }
}