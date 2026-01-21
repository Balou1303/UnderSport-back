import bdd from "../config/bdd.js";

const fetchAllLexicons = async () => {
    const sql = `SELECT lexiconId, name, description FROM lexicons;`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchLexiconsById = async (id) => {
    const sql = `SELECT lexiconId, name, description FROM lexicons WHERE lexiconId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createLexicon = async (name, description) => {
    const sql = `INSERT INTO lexicons (name, description) VALUES (?, ?);`;
    const [result] = await bdd.query(sql, [name, description]);
    return result;
};

const updateLexicon = async (name, description, id) => {
    const sql = `UPDATE lexicons SET name = ?, description = ? WHERE lexiconId = ?;`;
    const [result] = await bdd.query(sql, [name, description, id]);
    return result;
};

const deleteLexicon = async (id) => {
    const sql = `DELETE FROM lexicons WHERE lexiconId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

const fetchLexiconByName = async (name) => {
    const sql = `SELECT lexiconId, name, description FROM lexicons WHERE name = ?;`;
    const [result] = await bdd.query(sql, [name]);
    return result[0];
};

export default{
    fetchAllLexicons,
    fetchLexiconsById,
    createLexicon,
    updateLexicon,
    deleteLexicon,
    fetchLexiconByName
}