import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Servir les fichiers statiques (index.html, logo.png, etc.)
app.use(express.static(__dirname));

// Importer le handler de l'API
import handler from './api/chat.js';

// Route API
app.post('/api/chat', (req, res) => {
  handler(req, res);
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
  console.log(`📌 Clé API Groq: ${process.env.GROQ_API_KEY ? 'CONFIGURÉE ✓' : '⚠️ MANQUANTE - créez un fichier .env'}`);
});
