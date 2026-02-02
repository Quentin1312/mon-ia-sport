export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // 🔍 On demande à Google la liste des modèles disponibles pour votre clé
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    const data = await response.json();
    
    console.log("Modèles disponibles:", JSON.stringify(data, null, 2));
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: error.message });
  }
}