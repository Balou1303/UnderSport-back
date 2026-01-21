import bdd from "../config/bdd.js";

const fetchAllLegends = async () => {
    const sql = `
        SELECT l.legendId, l.firstname, l.lastname, l.photo, l.idSport, s.name as sportName
        FROM legends AS l
        INNER JOIN sports AS s ON l.idSport = s.sportId;`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchLegendById = async (id) => {
    const sql = `
        SELECT l.legendId, l.firstname, l.lastname, l.photo, l.idSport, s.name as sportName
        FROM legends AS l
        INNER JOIN sports AS s ON l.idSport = s.sportId
        WHERE l.legendId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createLegend = async (firstname, lastname, photo, idSport) => {
    const sql = `INSERT INTO legends (firstname, lastname, photo, idSport) VALUES (?, ?, ?, ?)`;
    const [result] = await bdd.query(sql, [firstname, lastname, photo, idSport]);
    return result;
};

const updateLegend = async (firstname, lastname, photo, idSport, id) => {
    const sql = `UPDATE legends SET firstname = ?, lastname = ?, photo = ?, idSport = ? WHERE legendId = ?`;
    const [result] = await bdd.query(sql, [firstname, lastname, photo, idSport, id]);
    return result;
};

const deleteLegend = async (id) => {
    const sql = `DELETE FROM legends WHERE legendId = ?`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

export default {
    fetchAllLegends,
    fetchLegendById,
    createLegend,
    updateLegend,
    deleteLegend
};