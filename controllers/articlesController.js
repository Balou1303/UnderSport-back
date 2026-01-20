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
        const { title, content, picture } = req.body;
        const idUser = req.user.id;

        if (!title || !content ) {
            res.status(400).json({ message: "Les champs sont obligatoires" });
            return;
        };

        const authorExists = await articlesModel.checkAuthorExists(idUser);
        if (!authorExists) {
            return res.status(404).json({ message: "L'auteur n'existe pas" });
        };

        const newArticle = await articlesModel.createArticle(title, content, picture, idUser);
        res.status(201).json(newArticle)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du article" });
    };
};

const updateArticle = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content, picture } = req.body;

        if (!title || !content) {
            res.status(400).json({ message: "Les champs sont obligatoires pour mettre à jour" });
            return;
        };

        const articleUpdate = await articlesModel.updateArticle(title, content, picture, id);
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

export default {
    getAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
};