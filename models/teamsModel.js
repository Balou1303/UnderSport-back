import bdd from "../config/bdd.js";

const fetchAllTeams = async () => {
    const sql = `SELECT teamId, name, logo, idSport FROM teams;`;
    const [result] = await bdd.query(sql)
    return result;
};

const fetchTeamsById = async (id) => {
    const sql = `SELECT teamId, name, logo, idSport FROM teams WHERE teamId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createTeam = async (name, logo, idSport) => {
    const sql = `INSERT INTO teams (name, logo, idSport) VALUES (?, ?, ?)`;
    const [result] = await bdd.query(sql, [name, logo, idSport]);
    return result;
};

const updateTeam = async (name, logo, idSport, id) => {
    const sql = `UPDATE teams SET name = ?, logo = ?, idSport = ? WHERE teamId = ?;`;
    const [result] = await bdd.query(sql, [name, logo, idSport, id]);
    return result;
};

const deleteTeam = async (id) => {
    const sql = `DELETE FROM teams WHERE teamId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

const fetchExistingTeam = async (name, idSport) => {
    const sql = `SELECT teamId FROM teams WHERE name = ? AND idSport = ?;`;
    const [result] = await bdd.query(sql, [name, idSport]);
    return result[0];
};

const addAchievementToTeam = async (idTeam, idAchievement, years) => {
    const sql = `INSERT INTO achievementsTeams (idTeam, idAchievement, years) VALUES (?, ?, ?)`;
    const [result] = await bdd.query(sql, [idTeam, idAchievement, years]);
    return result;
};

const checkAchievement = async (idTeam, idAchievement, years) => {
    const sql = `SELECT idTeam FROM achievementsTeams 
                 WHERE idTeam = ? AND idAchievement = ? AND years = ?`;
    const [result] = await bdd.query(sql, [idTeam, idAchievement, years]);
    return result[0];
};

export default {
    fetchAllTeams,
    fetchTeamsById,
    createTeam,
    updateTeam,
    deleteTeam,
    fetchExistingTeam,
    addAchievementToTeam,
    checkAchievement
};