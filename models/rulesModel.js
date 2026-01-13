import bdd from "../config/bdd.js";

const fetchAllRules = async () => {
    const sql = `SELECT ruleId, name, description FROM rules;`;
    const [result] = await bdd.query(sql)
    return result;
};

const fetchRulesById = async (id) => {
    const sql = `SELECT ruleId, name, description FROM rules WHERE ruleId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const createRule = async (name, description) => {
    const sql = `INSERT INTO rules (name, description) VALUES (?, ?)`;
    const [result] = await bdd.query(sql, [name, description]);
    return result;
};

const updateRule = async (name, description, id) => {
    const sql = `UPDATE rules SET name = ?, description = ? WHERE ruleId = ?;`;
    const [result] = await bdd.query(sql, [name, description, id]);
    return result;
};

const deleteRule = async (id) => {
    const sqlLinks = `DELETE FROM rulesSport WHERE idRule = ?;`; 
    await bdd.query(sqlLinks, [id]);

    const sql = `DELETE FROM rules WHERE ruleId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

export default {
    fetchAllRules,
    fetchRulesById,
    createRule,
    updateRule,
    deleteRule
};