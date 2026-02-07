import bdd from "../config/bdd.js";

const fetchAllChampionships = async () => {
    const sql = `SELECT c.championshipId, c.name, c.logo, c.idSport, s.name AS sportName
        FROM championships c
        JOIN sports s ON c.idSport = s.sportId
        ORDER BY s.name ASC, c.name ASC;`;
    const [result] = await bdd.query(sql)
    return result;
};

const fetchChampionshipById = async (id) => {
    const sql = `SELECT championshipId, name, logo, idSport FROM championships WHERE championshipId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createChampionship = async (name, logo, idSport) => {
    const sql = `INSERT INTO championships (name, logo, idSport) VALUES (?, ?, ?)`;
    const [result] = await bdd.query(sql, [name, logo, idSport]);
    return result;
};

const updateChampionship = async (name, logo, idSport, id) => {
    const sql = `UPDATE championships SET name = ?, logo = ?, idSport = ? WHERE championshipId = ?;`;
    const [result] = await bdd.query(sql, [name, logo, idSport, id]);
    return result;
};

const deleteChampionship = async (id) => {
    const sql = `DELETE FROM championships WHERE championshipId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

const fetchExistingChampionship = async (name, idSport) => {
    const sql = `SELECT championshipId FROM championships WHERE name = ? AND idSport = ?;`;
    const [result] = await bdd.query(sql, [name, idSport]);
    return result[0];
};

const fetchChampionshipsBySportId = async (idSport) => {
    const sql = `SELECT championshipId, name FROM championships WHERE idSport = ? ORDER BY name ASC`;
    const [result] = await bdd.query(sql, [idSport]);
    return result;
};

export default {
    fetchAllChampionships,
    fetchChampionshipById,
    createChampionship,
    updateChampionship,
    deleteChampionship,
    fetchExistingChampionship,
    fetchChampionshipsBySportId
};