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
    const sql = `DELETE FROM rules WHERE ruleId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

const getRulesBySportId = async (idSport) => {
    const sql = `
        SELECT r.ruleId, r.name, r.description 
        FROM rules r
        INNER JOIN rulesSports rs ON r.ruleId = rs.idRule
        WHERE rs.idSport = ?
    `;
    const [result] = await bdd.query(sql, [idSport]);
    return result;
};

const addRuleToSport = async (idRule, idSport) => {
    const sql = `INSERT INTO rulesSports (idRule, idSport) VALUES (?, ?)`;
    const [result] = await bdd.query(sql, [idRule, idSport]);
    return result;
};

const deleteRuleFromSport = async (idRule, idSport) => {
    const sql = `DELETE FROM rulesSports WHERE idRule = ? AND idSport = ?`;
    const [result] = await bdd.query(sql, [idRule, idSport]);
    return result;
};

export default {
    fetchAllRules,
    fetchRulesById,
    createRule,
    updateRule,
    deleteRule,
    getRulesBySportId,
    addRuleToSport,
    deleteRuleFromSport
};