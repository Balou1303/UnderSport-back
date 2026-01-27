import bdd from "../config/bdd.js";

const fetchAllSports = async () => {
    const sql = `SELECT sportId, name FROM sports;`;
    const [result] = await bdd.query(sql)
    return result;
};

const fetchSportsById = async (id) => {
    const sql = `SELECT sportId, name FROM sports WHERE sportId = ?;`;
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

const getLexiconBySportId = async (idSport) => {
    const sql = `
        SELECT l.lexiconId, l.name, l.description, s.name AS sportName
        FROM lexicons AS l
        INNER JOIN lexiconsSports AS ls ON l.lexiconId = ls.idLexicon
        INNER JOIN sports AS s ON ls.idSport = s.sportId
        WHERE ls.idSport = ?;`;
    const [result] = await bdd.query(sql, [idSport]);
    return result;
};

const checkLexiconLink = async (idSport, idLexicon) => {
    const sql = `SELECT idSport, idLexicon FROM lexiconsSports WHERE idSport = ? AND idLexicon = ?`;
    const [result] = await bdd.query(sql, [idSport, idLexicon]);
    return result[0];
};

const addLexiconToSport = async (idSport, idLexicon) => {
    const sql = `INSERT INTO lexiconsSports (idSport, idLexicon) VALUES (?, ?)`;
    const [result] = await bdd.query(sql, [idSport, idLexicon]);
    return result;
};

const deleteLexiconFromSport = async (idSport, idLexicon) => {
    const sql = `DELETE FROM lexiconsSports WHERE idSport = ? AND idLexicon = ?`;
    const [result] = await bdd.query(sql, [idSport, idLexicon]);
    return result;
};

export default {
    fetchAllSports,
    fetchSportsById,
    createSport,
    updateSport,
    deleteSport,
    fetchExistingSports,
    getLexiconBySportId,
    checkLexiconLink,
    addLexiconToSport,
    deleteLexiconFromSport
};