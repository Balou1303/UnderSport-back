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
        const { name, description, idSport } = req.body;
        if (!name || !description) {
            res.status(400).json({ message: "Les champs sont obligatoires" });
            return;
        };

        const createRules = await rulesModel.createRule(name, description);

        // Si un idSport est fourni, on lie la règle au sport
        if (idSport) {
            await rulesModel.addRuleToSport(createRules.insertId, idSport);
        }

        res.status(201).json({ message: "Règles créée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la règle" });
    };
};

const updateRule = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, idSport } = req.body;

        if (!name || !description) {
            res.status(400).json({ message: 'Un nom et une description sont obligatoires' });
            return;
        };

        // On vérifie d'abord si la règle existe
        const existingRule = await rulesModel.fetchRulesById(id);
        if (!existingRule) {
            return res.status(404).json({ message: "Règle non trouvée" });
        }

        // Mise à jour des textes
        await rulesModel.updateRule(name, description, id);

        // Mise à jour de l'association avec le sport
        if (idSport) {
            // On nettoie tous les liens existants pour cette règle et on crée le nouveau
            await rulesModel.deleteRuleFromSport(id, null);
            await rulesModel.addRuleToSport(id, idSport);
        }

        res.status(200).json({ message: "Règle mise à jour avec succès" });

    } catch (error) {
        console.error(error);
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

const getRulesBySport = async (req, res) => {
    try {
        const { idSport } = req.params;
        const rules = await rulesModel.getRulesBySportId(idSport);
        res.status(200).json(rules);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const addRuleToSport = async (req, res) => {
    try {
        const { idRule, idSport } = req.body; // On reçoit les deux IDs

        if (!idRule || !idSport) {
            return res.status(400).json({ message: "Il manque l'idRule ou l'idSport" });
        }

        const newRuleToSport = await rulesModel.addRuleToSport(idRule, idSport);
        res.status(200).json({ message: "Règle associée au sport avec succès" });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Cette règle est déjà associée à ce sport" });
        }
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const deleteRuleFromSport = async (req, res) => {
    try {
        const { idRule, idSport } = req.params;

        const disociateRuleFromSport = await rulesModel.deleteRuleFromSport(idRule, idSport);
        res.status(200).json({ message: "Règle dissociée du sport" });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export default {
    getAllRules,
    getRulesById,
    addRule,
    updateRule,
    deleteRule,
    getRulesBySport,
    addRuleToSport,
    deleteRuleFromSport
}