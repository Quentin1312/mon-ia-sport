// ========================================
// SOLUTION 3 : UTILISER GROQ (ULTRA RAPIDE + GRATUIT)
// ========================================
// GROQ est GRATUIT avec des limites très généreuses (6000 req/min!)
// Utilise Llama 3.1 ou Mixtral
// Inscrivez-vous sur : https://console.groq.com/
// Dans Vercel, ajoutez : GROQ_API_KEY=gsk_...

export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé Groq manquante" });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Très bon modèle gratuit
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Adapter la réponse au format attendu par votre frontend
    const formattedResponse = {
      candidates: [{
        content: {
          parts: [{
            text: data.choices[0].message.content
          }]
        }
      }]
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Erreur Groq:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
