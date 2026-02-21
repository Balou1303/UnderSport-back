import legendsModel from "../models/legendsModel.js";
import sportsModel from "../models/sportsModel.js";
import achievementsModel from "../models/achievementsModel.js"

const getAllLegends = async (req, res) => {
    try {
        const allLegend = await legendsModel.fetchAllLegends();
        res.status(200).json(allLegend);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des légendes" });
    }
};

const getLegendById = async (req, res) => {
    try {
        const id = req.params.id;
        const legendById = await legendsModel.fetchLegendById(id);

        if (!legendById) {
            return res.status(404).json({ message: "Légende non trouvée" });
        }

        res.status(200).json(legendById);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la légende" });
    }
};

const addLegend = async (req, res) => {
    try {
        const { firstname, lastname, idSport, description } = req.body;

        let photo = null;
        if (req.file) {
            photo = `/images/${req.file.filename}`;
        }

        if (!firstname || !lastname || !idSport) {
            return res.status(400).json({ message: "Le prénom, le nom et le sport de la légende sont obligatoires" });
        }

        const sportExists = await sportsModel.fetchSportsById(idSport);

        if (!sportExists) {
            return res.status(404).json({ message: "Le sport indiqué n'existe pas" });
        }

        const newLegend = await legendsModel.createLegend(firstname, lastname, photo, idSport, description);
        res.status(201).json({ message: "Légende créée", id: newLegend.insertId });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la légende" });
    }
};

const updateLegend = async (req, res) => {
    try {
        const id = req.params.id;
        const { firstname, lastname, idSport, description } = req.body;

        let photo;
        if (req.file) {
            photo = `/images/${req.file.filename}`;
        } else {
            photo = req.body.photo;
        }

        const legendExists = await legendsModel.fetchLegendById(id);
        if (!legendExists) {
            return res.status(404).json({ message: "Légende non trouvée" });
        }

        if (idSport) {
            const sportExists = await sportsModel.fetchSportsById(idSport);
            if (!sportExists) {
                return res.status(404).json({ message: "Le nouveau sport indiqué n'existe pas" });
            }
        }

        const legendeUpdate = await legendsModel.updateLegend(firstname, lastname, photo, idSport, description, id);
        res.status(200).json({ message: "Légende mise à jour" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la légende" });
    }
};

const deleteLegend = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await legendsModel.deleteLegend(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Légende non trouvée" });
        } else {
            res.status(200).json({ message: 'Légende supprimée' });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la légende" });
    }
};

const addAchievementToLegend = async (req, res) => {
    try {
        const idLegend = req.params.id;
        const { idAchievement, years } = req.body;

        if (!idAchievement || !years) {
            return res.status(400).json({ message: "L'ID du palmarès et l'année sont obligatoires" })
        }

        const legendExists = await legendsModel.fetchLegendById(idLegend);
        if (!legendExists) {
            return res.status(404).json({ message: "La légende n'existe pas" });
        }

        const achivementExists = await achievementsModel.fetchAchievementById(idAchievement);
        if (!achivementExists) {
            return res.status(404).json({ message: "'Palmarès introuvable" })
        }

        const achievementsLegendExists = await legendsModel.checkAchievement(idLegend, idAchievement, years)
        if (achievementsLegendExists) {
            return res.status(409).json({ message: "Ce palmarès de cette année est déjà associé à cette légende" });
        }

        const newAchievementsToLegend = await legendsModel.addAchievementToLegend(idLegend, idAchievement, years)
        return res.status(201).json({ message: "palamrès ajouté à la légende" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout d'un palmarès à une légende" })
    }
};

const getAchievementsByLegendId = async (req, res) => {
    try {
        const id = req.params.id;
        const achievements = await legendsModel.fetchAchievementsByLegendId(id);
        res.status(200).json(achievements);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du palmarès de la légende" });
    }
};

export default {
    getAllLegends,
    getLegendById,
    addLegend,
    updateLegend,
    deleteLegend,
    addAchievementToLegend,
    getAchievementsByLegendId
};