import bdd from "../config/bdd.js";

const fetchAllArticles = async () => {
    const sql = `
        SELECT 
            a.articleId, a.content, a.title, a.picture, a.publicationDate, a.updateDate, 
            a.isFeatured, a.views,
            u.firstName, u.lastName,
            GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS sportName,
            c.name AS championshipName
        FROM articles a
        JOIN users u ON a.idUser = u.userId
        LEFT JOIN sportsArticles sa ON a.articleId = sa.idArticle
        LEFT JOIN sports s ON sa.idSport = s.sportId
        LEFT JOIN championships c ON a.idChampionship = c.championshipId
        GROUP BY a.articleId, u.firstName, u.lastName, c.name, a.isFeatured, a.publicationDate, a.views
        ORDER BY a.isFeatured DESC, a.publicationDate DESC;`;

    const [result] = await bdd.query(sql);
    return result;
};

const fetchArticlesByUserId = async (idUser) => {
    const sql = `
        SELECT 
            a.articleId, a.content, a.title, a.picture, a.publicationDate, a.updateDate, 
            a.isFeatured, a.views,
            u.firstName, u.lastName,
            GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS sportName,
            c.name AS championshipName
        FROM articles a
        JOIN users u ON a.idUser = u.userId
        LEFT JOIN sportsArticles sa ON a.articleId = sa.idArticle
        LEFT JOIN sports s ON sa.idSport = s.sportId
        LEFT JOIN championships c ON a.idChampionship = c.championshipId
        WHERE a.idUser = ?
        GROUP BY a.articleId, u.firstName, u.lastName, c.name, a.isFeatured, a.publicationDate, a.views
        ORDER BY a.publicationDate DESC;`;

    const [result] = await bdd.query(sql, [idUser]);
    return result;
};

const fetchArticleById = async (id) => {
    const sql = `
        SELECT a.articleId, a.content, a.title, a.picture, a.publicationDate, a.updateDate, a.views, a.idChampionship,
        u.firstName, u.lastName
        FROM articles a
        JOIN users u ON a.idUser = u.userId
        WHERE articleId = ?;
    `;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const getArticleAuthorId = async (idArticle) => {
    const sql = `SELECT idUser FROM articles WHERE articleId = ?`;
    const [result] = await bdd.query(sql, [idArticle]);
    return result[0]?.idUser;
};

const createArticle = async (title, content, picture, idUser, idChampionship) => {
    const sql = `
        INSERT INTO articles (title, content, picture, idUser, idChampionship) 
        VALUES (?, ?, ?, ?, ?);`;
    const [result] = await bdd.query(sql, [title, content, picture, idUser, idChampionship]);
    return result;
};

const incrementViews = async (id) => {
    const sql = `UPDATE articles SET views = views + 1 WHERE articleId = ?`;
    await bdd.query(sql, [id]);
};

const updateArticle = async (title, content, picture, idChampionship, id) => {
    // Mise à jour automatique de 'updateDate' grâce à 'ON UPDATE CURRENT_TIMESTAMP'
    const sql = `
        UPDATE articles 
        SET title = ?, content = ?, picture = ?, idChampionship = ?
        WHERE articleId = ?;`;
    const [result] = await bdd.query(sql, [title, content, picture, idChampionship, id]);
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

const removeAllSportsFromArticle = async (idArticle) => {
    const sql = `DELETE FROM sportsArticles WHERE idArticle = ?`;
    const [result] = await bdd.query(sql, [idArticle]);
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

const getArticleByPopularity = async () => {
    const sql = `SELECT a.articleId, a.title, a.publicationDate, COUNT (c.commentId) AS totalComment
    FROM articles a
    LEFT JOIN comments AS c ON a.articleId = c.idArticle
    GROUP BY a.articleId
    ORDER BY totalComment DESC;`;
    const [result] = await bdd.query(sql);
    return result
}

const setFeatured = async (articleId) => {
    // permet de tout remettre à 0
    await bdd.query("UPDATE articles SET isFeatured = 0");

    // permet de mettre l'article sélectionné à "la Une"
    const sql = "UPDATE articles SET isFeatured = 1 WHERE articleId = ?";
    const [result] = await bdd.query(sql, [articleId]);
    return result;
};

const getDashboardStats = async (idUser = null) => {
    let userFilter = "";
    let params = [];
    if (idUser) {
        userFilter = " AND idUser = ?";
        params.push(idUser);
    }

    // Articles publiés les 7 derniers jours
    const sqlWeek = `SELECT COUNT(*) as count FROM articles WHERE publicationDate >= DATE_SUB(NOW(), INTERVAL 7 DAY)${userFilter}`;

    // Articles publiés les 30 derniers jours
    const sqlMonth = `SELECT COUNT(*) as count FROM articles WHERE publicationDate >= DATE_SUB(NOW(), INTERVAL 1 MONTH)${userFilter}`;

    // Total des vues
    // (WHERE 1=1 permet d'ajouter le AND idUser facilement ensuite)
    const sqlViews = `SELECT SUM(views) as totalViews FROM articles WHERE 1=1${userFilter}`;

    const [resultWeek] = await bdd.query(sqlWeek, params);
    const [resultMonth] = await bdd.query(sqlMonth, params);
    const [resultViews] = await bdd.query(sqlViews, params);

    return {
        articlesLastWeek: resultWeek[0].count,
        articlesLastMonth: resultMonth[0].count,
        totalViews: resultViews[0].totalViews || 0 // Si null (0 vues), on renvoie 0
    };
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
    removeAllSportsFromArticle,
    getSportsByArticleId,
    getArticlesBySport,
    getArticleByPopularity,
    setFeatured,
    getDashboardStats,
    incrementViews,
    fetchArticlesByUserId,
    getArticleAuthorId
};