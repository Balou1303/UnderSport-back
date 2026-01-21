import bdd from "../config/bdd.js";

const fetchAllBroadcasters = async () => {
    const sql = `SELECT broadcasterId, name, logo FROM broadcasters`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchBroadcasterById = async (id) => {
    const sql = `SELECT broadcasterId, name, logo FROM broadcasters WHERE broadcasterId = ?`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createBroadcaster = async (name, logo) => {
    const sql = `INSERT INTO broadcasters (name, logo) VALUES (?, ?)`;
    const [result] = await bdd.query(sql, [name, logo]);
    return result;
};

const updateBroadcaster = async (name, logo, id) => {
    const sql = `UPDATE broadcasters SET name = ?, logo = ? WHERE broadcasterId = ?`;
    const [result] = await bdd.query(sql, [name, logo, id]);
    return result;
};

const deleteBroadcaster = async (id) => {
    const sql = `DELETE FROM broadcasters WHERE broadcasterId = ?`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

const fetchBroadcasterByName = async (name) => {
    const sql = `SELECT broadcasterId FROM broadcasters WHERE name = ?`;
    const [result] = await bdd.query(sql, [name]);
    return result[0];
};

export default {
    fetchAllBroadcasters,
    fetchBroadcasterById,
    fetchBroadcasterByName,
    createBroadcaster,
    updateBroadcaster,
    deleteBroadcaster
};
