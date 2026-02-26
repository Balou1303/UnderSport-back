import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRoutes from './routes/usersRoutes.js';
import sportsRoutes from './routes/sportsRoutes.js';
import rulesRoutes from "./routes/rulesRoutes.js";
import teamsRoutes from "./routes/teamsRoutes.js";
import championshipsRoutes from "./routes/championshipsRoutes.js";
import matchesRoutes from "./routes/matchesRoutes.js";
import articlesRoutes from "./routes/articlesRoutes.js";
import commentsRoute from "./routes/commentsRoutes.js";
import broadcastersRoutes from "./routes/broadcastersRoutes.js";
import legendRoutes from "./routes/legendsRoutes.js";
import achievementsRoutes from "./routes/achievementsRoutes.js";
import lexiconsRoutes from "./routes/lexiconsRoutes.js";
import externalApiRoutes from "./routes/externalApiRoutes.js";

dotenv.config();

// CONFIGURATION DU CHEMIN (Indispensable pour que Node trouve le dossier)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// On dit : "Quand l'URL commence par /images, va chercher dans le dossier physique public/images"
app.use('/images', express.static(path.join(__dirname, 'public/picture')));

app.get("/", (req, res) => {
    res.json({ message: "Bienvenue dans l'API UnderSport 🏀​" })
});

app.use('/api/users', usersRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/championships', championshipsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/comments', commentsRoute);
app.use('/api/broadcasters', broadcastersRoutes);
app.use('/api/legends', legendRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/lexicons', lexiconsRoutes);
app.use('/api/external', externalApiRoutes);

app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log(`L'API est lancée sur http://localhost:${process.env.SERVER_PORT || 3000} ✅​`);
});