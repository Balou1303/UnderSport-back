import teamsModel from "../models/teamsModel.js";
import achievementsModel from "../models/achievementsModel.js";

const getAllTeams = async (req, res) => {
    try {
        const allTeams = await teamsModel.fetchAllTeams()
        res.status(200).json(allTeams)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des équipes" });
    };
};

const getTeamsById = async (req, res) => {
    try {
        const id = req.params.id;
        const teamsById = await teamsModel.fetchTeamsById(id);

        if (!teamsById) {
            return res.status(404).json({ message: "équipe non trouvée" });
        }
        res.status(200).json(teamsById)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'équipe" });
    };
};

const addTeam = async (req, res) => {
    try {
        const { name, logo, idSport } = req.body;
        if (!name || !idSport) {
            res.status(400).json({ message: "Le champ est obligatoire" });
            return;
        };
        const existingTeams = await teamsModel.fetchExistingTeam(name, idSport);
        if (existingTeams) {
            res.status(409).json({ message: "L'équipe existe déja" });
            return;
        };
        const createTeam = await teamsModel.createTeam(name, logo, idSport);
        res.status(201).json({ message: "équipe créée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'équipe" });
    };
};

const updateTeam = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, logo, idSport } = req.body;

        if (!name || !idSport) {
            res.status(400).json({ message: 'Un nom et un sport sont obligatoires' });
            return;
        };

        const existingTeam = await teamsModel.fetchExistingTeam(name, idSport);

        if (existingTeam && existingTeam.teamId != id) {
            return res.status(409).json({ message: "Le nom existe déjà" });
        };
        const teamUpdate = await teamsModel.updateTeam(name, logo, idSport, id);
        if (teamUpdate.affectedRows === 0) {
            res.status(404).json({ message: "équipe non trouvée" });
        } else {
            res.status(200).json({ message: "équipe mis à jour avec succès" });
        }

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await teamsModel.deleteTeam(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "équipe non trouvée" });
        } else {
            res.status(200).json({ message: "équipe supprimée avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'équipe" });
    }
};

const addAchievementToTeam = async (req, res) => {
    try {
        const idTeam = req.params.id;
        const { idAchievement, years } = req.body;

        if (!idAchievement || !years) {
            return res.status(400).json({ message: "L'ID du palmarès et l'année sont obligatoires" })
        }

        const teamExists = await teamsModel.fetchTeamsById(idTeam);
        if (!teamExists) {
            return res.status(404).json({ message: "L'équipe n'existe pas" });
        }

        const achievementExists = await achievementsModel.fetchAchievementById(idAchievement);
        if (!achievementExists) {
            return res.status(404).json({ message: "Palmarès introuvable" })
        }

        const linkExists = await teamsModel.checkAchievement(idTeam, idAchievement, years);
        if (linkExists) {
            return res.status(409).json({ message: "Ce trophée est déjà associé à cette équipe pour cette année" });
        }

        const newAchienvementToTeam = await teamsModel.addAchievementToTeam(idTeam, idAchievement, years);
        res.status(201).json({ message: "Palmarès ajouté à l'équipe" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout du palmarès" });
    }
};

export default {
    getAllTeams,
    getTeamsById,
    addTeam,
    updateTeam,
    deleteTeam,
    addAchievementToTeam
}