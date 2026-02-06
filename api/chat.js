export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { prompt } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Clé Anthropic manquante. Ajoutez ANTHROPIC_API_KEY dans les variables d'environnement Vercel.",
    });
  }

  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis." });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Adapter la réponse au format attendu par le frontend
    const text = data.content?.[0]?.text || "Pas de réponse.";
    const formattedResponse = {
      candidates: [{
        content: {
          parts: [{
            text: text
          }]
        }
      }]
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Erreur Anthropic:", error);
    res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}
