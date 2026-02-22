import achievementsModel from "../models/achievementsModel.js";

const getAllAchievement = async (req, res) => {
    try {
        const allAchievements = await achievementsModel.fetchAllAchievements();
        res.status(200).json(allAchievements);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récup des palmarès" });
    }
};

const getAchievementById = async (req, res) => {
    try {
        const id = req.params.id;
        const achievementById = await achievementsModel.fetchAchievementById(id);

        if (!achievementById) {
            return res.status(404).json({ message: "Palmarès non trouvé" });
        }

        res.status(200).json(achievementById);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récup du palmarès" });
    }
};

const addAchievement = async (req, res) => {
    try {
        const { label, type } = req.body;

        if (!label) {
            return res.status(400).json({ message: "Le nom du palmarès est obligatoire" });
        }

        const existingAchievement = await achievementsModel.fetchAchievementByLabel(label);

        if (existingAchievement) {
            return res.status(409).json({ message: "Ce palmarès existe déjà" });
        }

        const newAchievement = await achievementsModel.createAchievement(label, type);
        res.status(201).json({ message: "Palmarès créé", id: newAchievement.insertId });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création" });
    }
};

const updateAchievement = async (req, res) => {
    try {
        const id = req.params.id;
        const { label, type } = req.body;

        if (!label) {
            return res.status(400).json({ message: "Le nom du palmares est obligatoire" });
        }

        const achievementToUpdate = await achievementsModel.fetchAchievementById(id);
        if (!achievementToUpdate) {
            return res.status(404).json({ message: "palmarès non trouvé" });
        }

        const checkAchievement = await achievementsModel.fetchAchievementByLabel(label);
        if (checkAchievement && checkAchievement.achievementId !== parseInt(id)) {
            return res.status(409).json({ message: "Ce palmarès existe déjà" });
        }

        const achievementUpdate = await achievementsModel.updateAchievement(label, type, id);
        res.status(200).json({ message: "Palmarès mis à jour" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du palmarès" });
    }
};

const deleteAchievement = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await achievementsModel.deleteAchievement(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Palmarès non trouvé" });
        } else {
            res.status(200).json({ message: "Palmarès supprimé" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du palmarès" });
    }
};

export default {
    getAllAchievement,
    getAchievementById,
    addAchievement,
    updateAchievement,
    deleteAchievement
};