import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';
import sportsRoutes from './routes/sportsRoutes.js';
import rulesRoutes from "./routes/rulesRoutes.js";
import teamsRoutes from "./routes/teamsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Bienvenue dans l'API UnderSport 🏀​" })
});

app.use('/api/users', usersRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/teams', teamsRoutes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`L'API est lancée sur http://localhost:${process.env.SERVER_PORT} ✅​`);

})
