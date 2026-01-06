import bdd from "../config/bdd";

export const fetchAllUsers = async () => {
    const sql = `SELECT userId, nickname, email, firstName, lastName, picture FROM users;`;
    const [result] = await bdd.query(sql);
    return result;
}
