import bdd from "../config/bdd.js";

const fetchAllUsers = async () => {
    const sql = `SELECT userId, nickname, email, firstName, lastName, picture, idRole FROM users;`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchUsersById = async (id) => {
    const sql = `SELECT userId, nickname, email, firstName, lastName, picture, idRole FROM users
    WHERE userId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const addUser = async (nickname, email, password, firstName, lastName, picture) => {
    const sql = `INSERT INTO users
    (nickname, email, password, firstName, lastName, picture)
    VALUES (?, ?, ?, ?, ?, ?);`;
    const [result] = await bdd.query(sql, [nickname, email, password, firstName, lastName, picture])
    return result;
};

const updateUser = async (id, nickname, email, firstName, lastName, picture) => {
    const sql = `UPDATE users SET
    nickname = ?, email = ?, firstName = ?, lastName = ?, picture = ?
    WHERE userId = ?;`;
    const [result] = await bdd.query(sql, [nickname, email, firstName, lastName, picture, id]);
    return result;
}

const deleteUser = async (id) => {
    const sql = `DELETE FROM users WHERE userId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};

const fetchExistingUsers = async (email, nickname) => {
    const sql = `SELECT userId FROM users WHERE email = ? OR nickname = ?`;
    const [result] = await bdd.query(sql, [email, nickname]);
    return result[0];
}

const updatePassword = async (id, password) => {
    const sql = `UPDATE users SET password = ? WHERE userId = ?`;
    const [result] = await bdd.query(sql, [password, id]);
    return result;
}

const login = async (email) => {
    const sql = `SELECT userId, nickname, email, password, firstName, lastName, picture, idRole FROM users
    WHERE email = ?;`;
    const [result] = await bdd.query(sql, [email]);
    return result
}

const updateRoleUser = async (idRole, userId) => {
    const sql = `UPDATE users SET idRole = ? WHERE userId = ?`;
    const [result]= await bdd.query(sql, [idRole, userId]);
    return result;
}

export default {
    fetchAllUsers,
    fetchUsersById,
    addUser,
    updateUser,
    deleteUser,
    fetchExistingUsers,
    updatePassword,
    login,
    updateRoleUser
};
