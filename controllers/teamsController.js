import teamsModel from "../models/teamsModel.js";

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

export default {
    getAllTeams,
    getTeamsById,
    addTeam,
    updateTeam,
    deleteTeam
}