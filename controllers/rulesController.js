import rulesModel from "../models/rulesModel.js";

const getAllRules = async (req, res) => {
    try {
        const allRules = await rulesModel.fetchAllRules()
        res.status(200).json(allRules)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des règles" });
    };
};

const getRulesById = async (req, res) => {
    try {
        const id = req.params.id;
        const rulesById = await rulesModel.fetchRulesById(id);

        if (!rulesById) {
            return res.status(404).json({ message: "Règle non trouvée" });
        }
        res.status(200).json(rulesById)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la règles" });
    };
};

const addRule = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            res.status(400).json({ message: "Les champs sont obligatoires" });
            return;
        };
        const createRules = await rulesModel.createRule(name, description);
        res.status(201).json({ message: "Règles créée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la règle" });
    };
};

const updateRule = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        if (!name || !description) {
            res.status(400).json({ message: 'Un nom et une description sont obligatoires' });
            return;
        };

        const ruleUpdate = await rulesModel.updateRule(name, description, id);
        if (ruleUpdate.affectedRows === 0) {
            res.status(404).json({ message: "Règle non trouvée" });
        } else {
            res.status(200).json({ message: "Règle mise à jour avec succès" });
        }

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

const deleteRule = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await rulesModel.deleteRule(id);
        
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Règle non trouvée" });
        } else {
            res.status(200).json({ message: "Règle supprimée avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la règle" });
    }
};

export default {
    getAllRules,
    getRulesById,
    addRule,
    updateRule,
    deleteRule
}