export default async function handler(req, res) {
    // On vérifie que c'est bien une requête POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { prompt } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; // Ta clé sera cachée ici sur Vercel

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // On renvoie la réponse de l'IA à ton HTML
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "L'IA a eu un bug technique." });
    }
}