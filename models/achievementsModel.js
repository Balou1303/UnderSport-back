import bdd from "../config/bdd.js";

const fetchAllAchievements = async () => {
    const sql = `SELECT achievementId, label, type FROM achievements`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchAchievementById = async (id) => {
    const sql = `SELECT achievementId, label, type FROM achievements WHERE achievementId = ?`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const fetchAchievementByLabel = async (label) => {
    const sql = `SELECT achievementId, label, type FROM achievements WHERE label = ?`;
    const [result] = await bdd.query(sql, [label]);
    return result[0];
};

const createAchievement = async (label, type) => {
    const sql = `INSERT INTO achievements (label, type) VALUES (?, ?)`;
    const [result] = await bdd.query(sql, [label, type]);
    return result;
};

const updateAchievement = async (label, type, id) => {
    const sql = `UPDATE achievements SET label = ?, type = ? WHERE achievementId = ?`;
    const [result] = await bdd.query(sql, [label, type, id]);
    return result;
};

const deleteAchievement = async (id) => {
    const sql = `DELETE FROM achievements WHERE achievementId = ?`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

export default {
    fetchAllAchievements,
    fetchAchievementById,
    fetchAchievementByLabel,
    createAchievement,
    updateAchievement,
    deleteAchievement
};