import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware pour vérifier la validité du token
const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "Token manquant" });
    }

    // Extraire le token de l'en-tête Authorization
    const token = req.headers['authorization'].split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "token manquant" });
    }

    try {
        // Vérifier le token en utilisant la clé secrète
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeToken; 
        next(); // Passer au middleware ou au gestionnaire de route suivant

    } catch (error) {
        return res.status(401).json({ message: "token invalide" });
    }
};

export default checkToken;