export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // 🔍 DEBUG : Vérifier si la clé est bien chargée
  console.log("Clé API chargée:", apiKey ? "OUI ✅" : "NON ❌");
  console.log("Longueur de la clé:", apiKey?.length);

  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY n'est pas définie dans Vercel !" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    // 🔍 DEBUG : Voir la réponse complète de Google
    console.log("Réponse Google:", JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.error("Erreur Google:", data.error);
      return res.status(400).json({ error: data.error.message || data.error });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Problème de connexion serveur." });
  }
}