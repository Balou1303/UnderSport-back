import lexiconsModel from "../models/lexiconsModel.js";

const getAllLexicons = async (req, res) => {
    try {
        const AllLexicons = await lexiconsModel.fetchAllLexicons();
        res.status(200).json(AllLexicons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des lexiques" });
    }
};

const getLexiconById = async (req, res) => {
    try {
        const id = req.params.id;
        const lexiconById = await lexiconsModel.fetchLexiconsById(id);

        if (!lexiconById) {
            return res.status(404).json({ message: "Lexique non trouvée" });
        }

        res.status(200).json(lexiconById);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du lexique" });
    }
};

const addLexicon = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Le nom et la description sont obligatoires" });
        }

        const existingLexicon = await lexiconsModel.fetchLexiconByName(name);
        if (existingLexicon) {
            return res.status(409).json({ message: "Ce lexique existe déjà" });
        }

        const newLexicon = await lexiconsModel.createLexicon(name, description);
        res.status(201).json({ message: "Lexique ajouté", id: newLexicon.insertId });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du lexique" });
    }
};

const updateLexicon = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Le nom et la description sont obligatoires" });
        }

        const lexiconExists = await lexiconsModel.fetchLexiconsById(id);
        if (!lexiconExists) {
            return res.status(404).json({ message: "Lexique non trouvé" });
        }

        const checkName = await lexiconsModel.fetchLexiconByName(name);
        if (checkName && checkName.lexiconId !== parseInt(id)) {
            return res.status(409).json({ message: "Ce lexique existe déjà" });
        }

        const lexiconUpdate = await lexiconsModel.updateLexicon(name, description, id);
        res.status(200).json({ message: "Lexique mis à jour" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

const deleteLexicon = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await lexiconsModel.deleteLexicon(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Lexique non trouvé" });
        } else {
            res.status(200).json({ message: "Lexique supprimé" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du lexique" });
    }
};

export default {
    getAllLexicons,
    getLexiconById,
    addLexicon,
    updateLexicon,
    deleteLexicon
};