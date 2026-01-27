import broadcastersModel from "../models/broadcastersModel.js";
import matchesModel from "../models/matchesModel.js";
import broadcastersController from "./broadcastersController.js";

const getAllMatches = async (req, res) => {
    try {
        const allMatches = await matchesModel.fetchAllMatches();
        res.status(200).json(allMatches);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des matches" });
    };
};

const getMatchById = async (req, res) => {
    try {
        const id = req.params.id;
        const matchById = await matchesModel.fetchMatchById(id);

        if (!matchById) {
            res.status(404).json({ message: "Match non trouvé" });
            return;
        }
        res.status(200).json(matchById);

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du match" });
    };
};

const addMatch = async (req, res) => {
    try {
        const { matchDate, matchTime, idHomeTeam, idAwayTeam, idChampionship } = req.body;
        if (!matchDate || !matchTime || !idHomeTeam || !idAwayTeam || !idChampionship) {
            res.status(400).json({ message: "Les champs sont obligatoires" });
            return;
        };

        if (idHomeTeam === idAwayTeam) {
            res.status(400).json({ message: "Une équipe ne peut pas jouer contre elle même" });
            return;
        };

        const existingMatch = await matchesModel.fetchExistingMatch(idHomeTeam, idAwayTeam, matchDate);
        if (existingMatch) {
            res.status(409).json({ message: "Le match existe déja pour ce jour" });
            return;
        };

        const newMatch = await matchesModel.createMatch(matchDate, matchTime, idHomeTeam, idAwayTeam, idChampionship);
        res.status(201).json(newMatch)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du match" });
    };
};

const updateMatch = async (req, res) => {
    try {
        const id = req.params.id;
        const { matchDate, matchTime, scoreHome, scoreAway, idHomeTeam, idAwayTeam, idChampionship } = req.body;

        if (!matchDate || !matchTime || !idHomeTeam || !idAwayTeam || !idChampionship) {
            res.status(400).json({ message: "Les champs sont obligatoires pour mettre à jour" });
            return;
        };

        const existingMatch = await matchesModel.fetchExistingMatch(idHomeTeam, idAwayTeam, matchDate);
        if (existingMatch && existingMatch.matchId != id) {
            return res.status(409).json({ message: "Le match existe déjà" });
        };

        const matchUpdate = await matchesModel.updateMatch(matchDate, matchTime, scoreHome, scoreAway, idHomeTeam, idAwayTeam, idChampionship, id);
        if (matchUpdate.affectedRows === 0) {
            res.status(404).json({ message: "match non trouvée" });
        } else {
            res.status(200).json({ message: "match mis à jour avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du match" });
    };
};

const updateScore = async (req, res) => {
    try {
        const id = req.params.id;
        const { scoreHome, scoreAway } = req.body;

        if (scoreHome === undefined || scoreAway === undefined) {
            res.status(400).json({ message: "Les champs sont obligatoires pour mettre à jour le score" });
            return;
        };
        const scoreUpdate = await matchesModel.updateScore(scoreHome, scoreAway, id)
        res.status(200).json(scoreUpdate);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du score" });
    }
}

const deleteMatch = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await matchesModel.deleteMatch(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "match non trouvé" });
        } else {
            res.status(200).json({ message: "match supprimé avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du match" });
    }
};

const addBroadcasterToMatch = async (req, res) => {
    try {
        const idMatch = req.params.id;
        const { idBroadcaster } = req.body;

        if (!idBroadcaster) {
            return res.status(400).json({ message: "L'ID du diffuseur est obligatoire" })
        }

        const matchExists = await matchesModel.fetchMatchById(idMatch);
        if (!matchExists) {
            return res.status(404).json({ message: "Match introuvable" });
        }

        const broadcasterExists = await broadcastersModel.fetchBroadcasterById(idBroadcaster);
        if (!broadcasterExists) {
            return res.status(404).json({ message: "Diffuseur introuvable" });
        }

        const broadcastersMatchsExists = await matchesModel.checkBrodacastersMatches(idBroadcaster, idMatch);
        if (broadcastersMatchsExists) {
            return res.status(409).json({ message: "Ce match est déjà associé à ce diffuseur" });
        }

        const newMatchToBroadcaster = await matchesModel.addBroadcasterToMatch(idBroadcaster, idMatch);
        res.status(201).json({ message: "Match ajouté à un diffuseur" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout d'un diffuseur à un match" })
    }
}

export default {
    getAllMatches,
    getMatchById,
    addMatch,
    updateMatch,
    updateScore,
    deleteMatch,
    addBroadcasterToMatch
};