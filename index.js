import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
    res.json({message : "Bienvenue dans l'API UnderSport"})
});

app.listen(process.env.SERVER_PORT, () =>{
    console.log(`L'API est lancée sur http://localhost:${process.env.SERVER_PORT}`);
    
})