import sportsModel from "../models/sportsModel.js";

const getAllSports = async (req, res) => {
    try {
        const allSports = await sportsModel.fetchAllSports()
        res.status(200).json(allSports)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des sports" });
    };
};

const getSportsById = async (req, res) => {
    try {
        const id = req.params.id;
        const sportsById = await sportsModel.fetchSportsById(id);

        if (!sportsById) {
            return res.status(404).json({ message: "Sport non trouvé" });
        }
        res.status(200).json(sportsById)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du sport" });
    };
};

const addSport = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: "Le champ est obligatoire" });
            return;
        };
        const existingSport = await sportsModel.fetchExistingSports(name);
        if (existingSport) {
            res.status(409).json({ message: "Le sport existe déja" });
            return;
        };
        const createSport = await sportsModel.createSport(name);
        res.status(201).json({ message: "Sport créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du sport" });
    };
};

const updateSport = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Un nom est obligatoire' });
            return;
        };

        const existingSport = await sportsModel.fetchExistingSports(name);

        if (existingSport && existingSport.sportId != id) {
            return res.status(409).json({ message: "Le nom existe déjà" });
        };
        const sportUpdate = await sportsModel.updateSport(name, id);
        res.status(200).json(sportUpdate);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du sport" });
    };
};

const deleteSport = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sportsModel.deleteSport(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Sport non trouvé" });
        } else {
            res.status(200).json({ message: "Sport supprimé avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du sport" });
    }
};

export default {
    getAllSports,
    getSportsById,
    addSport,
    updateSport,
    deleteSport
}