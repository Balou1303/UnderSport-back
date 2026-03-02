import bdd from "../config/bdd.js";

const fetchAllLegends = async () => {
    const sql = `
        SELECT l.legendId, l.firstname, l.lastname, l.photo, l.idSport, l.description, s.name as sportName
        FROM legends AS l
        INNER JOIN sports AS s ON l.idSport = s.sportId
        ORDER BY l.lastname ASC;`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchLegendById = async (id) => {
    const sql = `
        SELECT l.legendId, l.firstname, l.lastname, l.photo, l.idSport, l.description, s.name as sportName
        FROM legends AS l
        INNER JOIN sports AS s ON l.idSport = s.sportId
        WHERE l.legendId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createLegend = async (firstname, lastname, photo, idSport, description) => {
    const sql = `INSERT INTO legends (firstname, lastname, photo, idSport, description) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await bdd.query(sql, [firstname, lastname, photo, idSport, description]);
    return result;
};

const updateLegend = async (firstname, lastname, photo, idSport, description, id) => {
    const sql = `UPDATE legends SET firstname = ?, lastname = ?, photo = ?, idSport = ?, description = ? WHERE legendId = ?`;
    const [result] = await bdd.query(sql, [firstname, lastname, photo, idSport, description, id]);
    return result;
};

const deleteLegend = async (id) => {
    const sql = `DELETE FROM legends WHERE legendId = ?`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

const addAchievementToLegend = async (idLegend, idAchievement, years) => {
    const sql = `INSERT INTO achievementsLegends (idLegend, idAchievement, years) VALUES (?, ?, ?);`;
    const [result] = await bdd.query(sql, [idLegend, idAchievement, years]);
    return result;
};

const fetchAchievementsByLegendId = async (idLegend) => {
    const sql = `
        SELECT a.achievementId, a.label, a.type, al.years 
        FROM achievementsLegends al
        INNER JOIN achievements a ON al.idAchievement = a.achievementId
        WHERE al.idLegend = ?
        ORDER BY al.years DESC;
    `;
    const [result] = await bdd.query(sql, [idLegend]);
    return result;
};

// pour éviter de mettre 2 fois le même trophée la même année
const checkAchievement = async (idLegend, idAchievement, years) => {
    const sql = `SELECT idLegend FROM achievementsLegends
    WHERE idLegend = ? AND idAchievement =? AND years = ?;`;
    const [result] = await bdd.query(sql, [idLegend, idAchievement, years]);
    return result[0];
}

const removeAchievementFromLegend = async (idLegend, idAchievement, years) => {
    const sql = `DELETE FROM achievementsLegends WHERE idLegend = ? AND idAchievement = ? AND years = ?;`;
    const [result] = await bdd.query(sql, [idLegend, idAchievement, years]);
    return result;
};

export default {
    fetchAllLegends,
    fetchLegendById,
    createLegend,
    updateLegend,
    deleteLegend,
    addAchievementToLegend,
    fetchAchievementsByLegendId,
    checkAchievement,
    removeAchievementFromLegend
};