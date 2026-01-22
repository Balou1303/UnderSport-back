import sportsModel from "../models/sportsModel.js";
import lexiconsModel from "../models/lexiconsModel.js";

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
        if (sportUpdate.affectedRows === 0) {
            res.status(404).json({ message: "Sport non trouvé" });
        } else {
            res.status(200).json({ message: "Sport mis à jour avec succès" });
        }

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
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

const getLexiconBySport = async (req, res) => {
    try {
        const idSport = req.params.id;
        const lexiconBySport = await sportsModel.getLexiconBySportId(idSport);

        res.status(200).json(lexiconBySport);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du lexique" });
    }
};

const addLexiconToSport = async (req, res) => {
    try {
        const idSport = req.params.id;
        const { idLexicon } = req.body;

        if (!idLexicon) {
            return res.status(400).json({ message: "L'ID du lexique est obligatoire" });
        }

        const sportExists = await sportsModel.fetchSportsById(idSport);
        if (!sportExists) {
            return res.status(404).json({ message: "Sport introuvable" });
        }

        const lexiconExists = await lexiconsModel.fetchLexiconsById(idLexicon);
        if (!lexiconExists) {
            return res.status(404).json({ message: "Définition introuvable" });
        }

        const linkExists = await sportsModel.checkLexiconLink(idSport, idLexicon);
        if (linkExists) {
            return res.status(409).json({ message: "Ce mot est déjà associé à ce sport" });
        }

        const newLexiconBySport = await sportsModel.addLexiconToSport(idSport, idLexicon);
        res.status(201).json({ message: "Définition ajoutée au sport" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de l'ajout" });
    }
};

const deleteLexiconFromSport = async (req, res) => {
    try {
        const { idSport, idLexicon } = req.params;

        const dissociateSport = await sportsModel.deleteLexiconFromSport(idSport, idLexicon);
        if (dissociateSport.affectedRows === 0) {
            return res.status(404).json({ message: "Lien introuvable ou déjà supprimé" });
        }
        res.status(200).json({ message: "Définition retirée du sport" });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
};

export default {
    getAllSports,
    getSportsById,
    addSport,
    updateSport,
    deleteSport,
    getLexiconBySport,
    addLexiconToSport,
    deleteLexiconFromSport
}