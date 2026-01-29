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
        const articleById = await articlesModel.fetchArticleById(id);

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
        const { title, content, picture, idChampionship } = req.body; 
        const idUser = req.user.id;

        if (!title || !content) {
             return res.status(400).json({ message: "Les champs titre et contenu sont obligatoires" });
        }

        const newArticle = await articlesModel.createArticle(title, content, picture, idUser, idChampionship);
        
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ message: "Erreur..." });
    }
};

const updateArticle = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content, picture, idChampionship } = req.body;

        if (!title || !content) {
            res.status(400).json({ message: "Les champs sont obligatoires pour mettre à jour" });
            return;
        };

        const articleUpdate = await articlesModel.updateArticle(title, content, picture, idChampionship, id);
        if (articleUpdate.affectedRows === 0) {
            res.status(404).json({ message: "article non trouvée" });
        } else {
            res.status(200).json({ message: "article mis à jour avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du article" });
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
        console.log(error);
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
       const{idSport} = req.params;
       const articlesBySport = await articlesModel.getArticlesBySport(idSport);
       res.status(200).json(articlesBySport) 
    } catch (error) {
        res.status(500).json({message: "Erreur lors de la récupération des articles par sports"});
    }
}

const getPopularity = async (req, res) => {
    try {
        const result = await articlesModel.getArticleByPopularity();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        
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
    defineFeatured
};