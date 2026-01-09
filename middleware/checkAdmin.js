const checkAdmin = (req, res, next) => {
    // req.user contient les infos du token (grâce à checkToken juste avant)
    // Sécurité : si jamais checkToken a été oublié dans la route
    if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non connecté" });
    }

    // vérification si c'est si bien un admin
    if (req.user.idRole !== 1) {
        return res.status(403).json({ message: "Accès interdit : Vous n'êtes pas administrateur" });
    }

    // C'est un admin ? Il passe !
    next();
};

export default checkAdmin;