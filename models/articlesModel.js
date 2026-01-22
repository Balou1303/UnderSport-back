import bdd from "../config/bdd.js";

const fetchAllArticles = async () => {
    const sql = `
        SELECT a.articleId, a.content, a.title, a.picture, a.publicationDate, a.updateDate, u.nickname AS authorName  
        FROM articles a
        JOIN users u ON a.idUser = u.userId;
    `;

    const [result] = await bdd.query(sql);
    return result;
};

const fetchArticleById = async (id) => {
    const sql = `
        SELECT a.articleId, a.content, a.title, a.picture, a.publicationDate, a.updateDate, u.nickname AS authorName
        FROM articles a
        JOIN users u ON a.idUser = u.userId
        WHERE articleId = ?;
    `;
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

const checkAuthorExists = async (idUser) => {
    const sql = `SELECT userId FROM users WHERE userId = ?`;
    const [result] = await bdd.query(sql, [idUser]);
    return result[0];
};

const addSportToArticle = async (idArticle, idSport) => {
    const sql = `INSERT INTO sportsArticles (idArticle, idSport) VALUES (?, ?)`;
    const [result] = await bdd.query(sql, [idArticle, idSport]);
    return result;
};

const removeSportFromArticle = async (idArticle, idSport) => {
    const sql = `DELETE FROM sportsArticles WHERE idArticle = ? AND idSport = ?`;
    const [result] = await bdd.query(sql, [idArticle, idSport]);
    return result;
};


const getSportsByArticleId = async (idArticle) => {
    const sql = `
        SELECT s.sportId, s.name
        FROM sports s
        JOIN sportsArticles sa ON s.sportId = sa.idSport
        WHERE sa.idArticle = ?
    `;
    const [result] = await bdd.query(sql, [idArticle]);
    return result;
};

export default {
    fetchAllArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    checkAuthorExists,
    addSportToArticle,
    removeSportFromArticle,
    getSportsByArticleId
};