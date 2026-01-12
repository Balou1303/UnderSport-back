import bdd from "../config/bdd.js";

const fetchAllSports = async () => {
    const sql = `SELECT sportId, name FROM sports;`;
    const [result] = await bdd.query(sql)
    return result;
};

const fetchSportsById = async (id) => {
    const sql = `SELECT name FROM sports WHERE sportId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createSport = async (name) => {
    const sql = `INSERT INTO sports (name) VALUES (?)`;
    const [result] = await bdd.query(sql, [name]);
    return result;
};

const updateSport = async (name, id) => {
    const sql = `UPDATE sports SET name = ? WHERE sportId = ?;`;
    const [result] = await bdd.query(sql, [name, id]);
    return result;
};

const deleteSport = async (id) => {
    const sql = `DELETE FROM sports WHERE sportId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

const fetchExistingSports = async (name) => {
    const sql = `SELECT sportId FROM sports WHERE name = ?;`;
    const [result] = await bdd.query(sql, [name]);
    return result[0];
};

export default {
    fetchAllSports,
    fetchSportsById,
    createSport,
    updateSport,
    deleteSport,
    fetchExistingSports
};