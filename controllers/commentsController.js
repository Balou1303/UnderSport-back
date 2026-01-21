import commentsModel from "../models/commentsModel.js";
import articlesModel from "../models/articlesModel.js";

const getAllComments = async (req, res) => {
    try {
        const allComments = await commentsModel.fetchAllComments();
        res.status(200).json(allComments);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des commentaires" });
    }
};

const getCommentsByArticle = async (req, res) => {
    try {
        const idArticle = req.params.id;
        const comments = await commentsModel.fetchCommentsByArticle(idArticle);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des commentaires de l'article" });
    }
};

const addComment = async (req, res) => {
    try {
        const { content, idArticle } = req.body;
        const idUser = req.user.id;

        if (!content || !idArticle) {
            return res.status(400).json({ message: "Le contenu et l'article sont obligatoires" });
        }

        const articleExists = await articlesModel.fetchArticleById(idArticle);
        if (!articleExists) {
            return res.status(404).json({ message: "L'article n'existe pas" });
        }

        const newComment = await commentsModel.createComment(content, idUser, idArticle);
        res.status(201).json({ message: "Commentaire ajouté", commentId: newComment.insertId });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du commentaire" });
    }
};

const updateComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { content } = req.body;
        const idUserConnected = req.user.id;
        const roleUserConnected = req.user.idRole;

        if (!content) {
            return res.status(400).json({ message: "Le contenu est obligatoire" });
        }

        const comment = await commentsModel.fetchCommentById(id);
        if (!comment) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        // Vérif si auteur du commentaire ou Admin
        if (idUserConnected !== comment.idUser && roleUserConnected !== 1) {
            return res.status(403).json({ message: "Vous n'avez pas le droit de modifier ce commentaire" });
        }

        const commentUpdate = await commentsModel.updateComment(content, id);
        res.status(200).json({ message: "Commentaire mis à jour" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du commentaires" });
    }
};

const deleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        const idUserConnected = req.user.id;
        const roleUserConnected = req.user.idRole;

        // 👇 AJOUT SÉCURITÉ : On vérifie qui veut supprimer
        const comment = await commentsModel.fetchCommentById(id);
        
        if (!comment) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        // On autorise la suppression SI c''est l'auteur du commentaire
        // si c'est un Admin
        // si c'est un Journaliste (Pour la modération)
        if (idUserConnected !== comment.idUser && roleUserConnected !== 1 && roleUserConnected !== 2) {
             return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer ce commentaire" });
        }

        const result = await commentsModel.deleteComment(id);
        res.status(200).json({ message: "Commentaire supprimé" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
};

export default {
    getAllComments, 
    getCommentsByArticle,
    addComment,
    updateComment,
    deleteComment
};