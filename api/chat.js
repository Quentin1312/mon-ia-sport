export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { prompt } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Clé Groq manquante. Ajoutez GROQ_API_KEY dans les variables d'environnement Vercel.",
    });
  }

  if (!prompt) {
    return res.status(400).json({ error: "Le prompt est requis." });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant francophone. Tu réponds TOUJOURS en français. Tu es spécialisé en nutrition, sport et cuisine healthy. Quand on te donne des ingrédients, tu proposes des recettes détaillées avec les macros (protéines, calories). Sois concis et motivant."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Adapter la réponse au format attendu par le frontend
    const text = data.choices?.[0]?.message?.content || "Pas de réponse.";
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
    console.error("Erreur Groq:", error);
    res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
}
