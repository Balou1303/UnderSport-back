import bdd from "../config/bdd.js";

const fetchAllArticles = async () => {
    const sql = `SELECT articleId, content, title, picture, publicationDate, updateDate, idUser FROM articles;`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchArticleById = async (id) => {
    const sql = `SELECT articleId, content, title, picture, publicationDate, updateDate, idUser FROM articles
    WHERE articleId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createArticle = async (title, content, picture, idUser) => {
    const sql = `
        INSERT INTO articles (title, content, picture, idUser) 
        VALUES (?, ?, ?, ?);`;
    const [result] = await bdd.query(sql, [title, content, picture, idUser]);
    return result;
};

const updateArticle = async (title, content, picture, id) => {
    // SQL va mettre à jour 'updateDate' tout seul grâce à 'ON UPDATE CURRENT_TIMESTAMP'
    const sql = `
        UPDATE articles 
        SET title = ?, content = ?, picture = ? 
        WHERE articleId = ?;`;
    const [result] = await bdd.query(sql, [title, content, picture, id]);
    return result;
};

const deleteArticle = async (id) => {
    const sql = `DELETE FROM articles WHERE articleId = ?`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

// Pour vérifier si l'auteur existe avant de poster
const checkAuthorExists = async (idUser) => {
    const sql = `SELECT userId FROM users WHERE userId = ?`;
    const [result] = await bdd.query(sql, [idUser]);
    return result[0];
};

export default {
    fetchAllArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    checkAuthorExists
};