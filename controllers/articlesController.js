import articlesModel from "../models/articlesModel.js";

const getAllArticles = async (req, res) => {
    try {
        const allArticles = await articlesModel.fetchAllArticles();
        res.status(200).json(allArticles);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des articles" });
    };
};

const getArticleById = async (req, res) => {
    try {
        const id = req.params.id;
        // si admin = true, considère que c'est le mode "amdin"
        const isAdminMode = req.query.admin === 'true';
        const articleById = await articlesModel.fetchArticleById(id);
        // incrément les vues seulement si pas dans le mode "admin"
        if (!isAdminMode) {
            await articlesModel.incrementViews(id);
        }

        if (!articleById) {
            res.status(404).json({ message: "article non trouvé" });
            return;
        }
        res.status(200).json(articleById);

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du article" });
    };
};

const addArticle = async (req, res) => {
    try {
        const { title, content, idSport } = req.body;
        const idUser = req.user ? req.user.id : null;

        if (!idUser)
            return res.status(401).json({ message: "Utilisateur non identifié" });

        const idChampionship = req.body.idChampionship === "" || req.body.idChampionship === "undefined"
            ? null
            : req.body.idChampionship;

        let picture = null;
        // Si Multer a un fichier, on met à jour le chemin
        if (req.file) {
            picture = `/images/${req.file.filename}`;
        }

        if (!title || !content) {
            return res.status(400).json({ message: "Les champs titre et contenu sont obligatoires" });
        }

        const newArticle = await articlesModel.createArticle(title, content, picture, idUser, idChampionship);
        const articleId = newArticle.insertId;

        if (idSport) {
            await articlesModel.addSportToArticle(articleId, idSport);
        }

        res.status(201).json(newArticle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur...", error });
    }
};

const updateArticle = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content, idSport } = req.body

        const idChampionship = req.body.idChampionship === "" || req.body.idChampionship === "undefined"
            ? null
            : req.body.idChampionship;

        let picture;

        if (req.file) {
            // S'il y a un nouveau fichier, on prend son chemin
            picture = `/images/${req.file.filename}`;
        } else {
            // Si il n'y pas de nouveau fichier, on garde l'URL existante
            picture = req.body.picture;
        }

        if (!title || !content) {
            return res.status(400).json({ message: "Les champs sont obligatoires pour mettre à jour" });
        };

        const articleUpdate = await articlesModel.updateArticle(title, content, picture, idChampionship, id);
        if (idSport && idSport !== "undefined" && idSport !== "") {
            //supprime les anciens liens de sport pour cet article
            await articlesModel.removeAllSportsFromArticle(id);
            //ajoute le nouveau sport
            await articlesModel.addSportToArticle(id, idSport);
        }

        if (articleUpdate.affectedRows === 0) {
            res.status(404).json({ message: "Article non trouvé" });
        } else {
            res.status(200).json({ message: "Article mis à jour avec succès" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'article" });
    };
};

const deleteArticle = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await articlesModel.deleteArticle(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "article non trouvé" });
        } else {
            res.status(200).json({ message: "article supprimé avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du article" });
    }
};

const addSportToArticle = async (req, res) => {
    try {
        const { idArticle, idSport } = req.body;

        await articlesModel.addSportToArticle(idArticle, idSport);
        res.status(200).json({ message: "Sport associé à l'article" });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Ce sport est déjà lié à cet article" });
        }
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const deleteSportFromArticle = async (req, res) => {
    try {
        const { idArticle, idSport } = req.params;

        const result = await articlesModel.removeSportFromArticle(idArticle, idSport);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Lien non trouvé" });
        }

        res.status(200).json({ message: "Sport retiré de l'article" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors du retrait du sport de l'article" });
    }
};

const getSportsByArticle = async (req, res) => {
    try {
        const { idArticle } = req.params;
        const sports = await articlesModel.getSportsByArticleId(idArticle);
        res.status(200).json(sports);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getArticlesBySport = async (req, res) => {
    try {
        const { idSport } = req.params;
        const articlesBySport = await articlesModel.getArticlesBySport(idSport);
        res.status(200).json(articlesBySport)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des articles par sports" });
    }
}

const getPopularity = async (req, res) => {
    try {
        const result = await articlesModel.getArticleByPopularity();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'analyse de popularité" });
    }
};

const defineFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        await articlesModel.setFeatured(id);
        res.json({ message: "Article mis à la une avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur de la mise à la une de l'article" });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await articlesModel.getDashboardStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
};

export default {
    getAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    addSportToArticle,
    deleteSportFromArticle,
    getSportsByArticle,
    getArticlesBySport,
    getPopularity,
    defineFeatured,
    getStats
};