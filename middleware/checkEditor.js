const checkEditor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Non autorisé" });
    }

    if (req.user.idRole === 1 || req.user.idRole === 2) {
        next();
    } else {
        return res.status(403).json({ message: "Accès interdit : Réservé aux rédacteurs." });
    }
};

export default checkEditor;