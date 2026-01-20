import bdd from "../config/bdd.js";

const fetchAllMatches = async () => {
    const sql = `SELECT matchId, matchDate, matchTime, scoreHome, scoreAway, idHomeTeam, idAwayTeam, idChampionship FROM matches;`;
    const [result] = await bdd.query(sql);
    return result;
};

const fetchMatchById = async (id) => {
    const sql = `SELECT matchId, matchDate, matchTime, scoreHome, scoreAway, idHomeTeam, idAwayTeam, idChampionship FROM matches
    WHERE matchId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result[0];
};

const fetchExistingMatch = async (idHomeTeam, idAwayTeam, matchDate) => {
    const sql = `SELECT matchId FROM matches
    WHERE idHomeTeam = ? AND idAwayTeam = ? AND matchDate = ?;`;
    const [result] = await bdd.query(sql, [idHomeTeam, idAwayTeam, matchDate]);
    return result[0];
};

const createMatch = async (matchDate, matchTime, idHomeTeam, idAwayTeam, idChampionship) => {
    const sql = `INSERT INTO matches (matchDate, matchTime, idHomeTeam, idAwayTeam, idChampionship)
    VALUES (?, ?, ?, ?, ?);`;
    const [result] = await bdd.query(sql, [matchDate, matchTime, idHomeTeam, idAwayTeam, idChampionship]);
    return result;
};

const updateMatch = async (matchDate, matchTime, scoreHome, scoreAway, idHomeTeam, idAwayTeam, idChampionship, id) => {
    const sql = `UPDATE matches
    SET matchDate = ?, matchTime = ?, scoreHome = ?, scoreAway = ?, idHomeTeam = ?, idAwayTeam = ?, idChampionship = ?
    WHERE matchId = ?;`;
    const [result] = await bdd.query(sql, [matchDate, matchTime, scoreHome, scoreAway, idHomeTeam, idAwayTeam, idChampionship, id]);
    return result;
};

const updateScore = async (scoreHome, scoreAway, id) => {
    const sql = `UPDATE matches
    SET scoreHome = ?, scoreAway = ?
    WHERE matchId = ?;`;
    const [result] = await bdd.query(sql, [scoreHome, scoreAway, id]);
    return result;
};

const deleteMatch = async (id) => {
    const sql = `DELETE FROM matches WHERE matchId = ?;`;
    const [result] = await bdd.query(sql, [id]);
    return result;
};



export default {
    fetchAllMatches,
    fetchMatchById,
    fetchExistingMatch,
    createMatch,
    updateMatch,
    updateScore,
    deleteMatch
}