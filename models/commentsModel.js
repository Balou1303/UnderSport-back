import bdd from "../config/bdd.js";

const fetchAllComments = async () => {
    const sql = `SELECT commentId, content, date, idUser, idArticle FROM comments;`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchCommentsByArticle = async (idArticle) => {
    const sql = `SELECT c.commentId, c.content, c.date, c.idUser, c.idArticle, u.firstName, u.lastName
    FROM comments c
    INNER JOIN users AS u ON c.idUser = u.userId
    WHERE c.idArticle = ? 
    ORDER BY date DESC;`;
    const [result] = await bdd.query(sql, [idArticle]);
    return result;
};

const fetchCommentById = async (id) => {
    const sql = `SELECT commentId, content, date, idUser, idArticle FROM comments 
    WHERE commentId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createComment = async (content, idUser, idArticle) => {
    const sql = `INSERT INTO comments (content, idUser, idArticle) 
        VALUES (?, ?, ?);`;
    const [result] = await bdd.query(sql, [content, idUser, idArticle]);
    return result;
};

const updateComment = async (content, id) => {
    const sql = `UPDATE comments SET content = ? WHERE commentId = ?`;
    const [result] = await bdd.query(sql, [content, id]);
    return result;
};

const deleteComment = async (id) => {
    const sql = `DELETE FROM comments WHERE commentId = ?`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

export default {
    fetchAllComments,
    fetchCommentsByArticle,
    fetchCommentById,
    createComment,
    updateComment,
    deleteComment
};