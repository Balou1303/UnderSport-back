import bdd from "../config/bdd.js";

const fetchAllArticles = async () => {
    const sql = `
        SELECT a.articleId, a.content, a.title, a.picture, a.publicationDate, a.updateDate, u.firstName, u.lastName  
        FROM articles a
        JOIN users u ON a.idUser = u.userId;
    `;

    const [result] = await bdd.query(sql);
    return result;
};

const fetchArticleById = async (id) => {
    const sql = `
        SELECT a.articleId, a.content, a.title, a.picture, a.publicationDate, a.updateDate, u.firstName, u.lastName
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

const getArticlesBySport = async (idSport) => {
    const sql = `SELECT a.articleId, a.content, a.title, a.picture, a.publicationDate, a.updateDate, u.firstName, u.lastName
    FROM articles a
    INNER JOIN sportsArticles AS sa ON a.articleId = sa.idArticle
    INNER JOIN users AS u ON a.idUser = u.userId
    WHERE sa.idSport = ?`;
    const [result] = await bdd.query(sql, [idSport]);
    return result;
};

const getArticleByPopularity = async() => {
    const sql = `SELECT a.articleId, a.title, a.publicationDate, COUNT (c.commentId) AS totalComment
    FROM articles a
    LEFT JOIN comments AS c ON a.articleId = c.idArticle
    GROUP BY a.articleId
    ORDER BY totalComment DESC;`;
    const [result] = await bdd.query(sql);
    return result
}

export default {
    fetchAllArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    checkAuthorExists,
    addSportToArticle,
    removeSportFromArticle,
    getSportsByArticleId,
    getArticlesBySport,
    getArticleByPopularity
};