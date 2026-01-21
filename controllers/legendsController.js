import legendsModel from "../models/legendsModel.js";
import sportsModel from "../models/sportsModel.js";

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
        const { firstname, lastname, photo, idSport } = req.body;

        if (!firstname || !lastname || !idSport) {
            return res.status(400).json({ message: "Le prénom, le nom et le sport de la légende sont obligatoires" });
        }

        const sportExists = await sportsModel.fetchSportsById(idSport); 
        
        if (!sportExists) {
            return res.status(404).json({ message: "Le sport indiqué n'existe pas" });
        }

        const newLegend = await legendsModel.createLegend(firstname, lastname, photo, idSport);
        res.status(201).json({ message: "Légende créée", id: newLegend.insertId });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la légende" });
    }
};

const updateLegend = async (req, res) => {
    try {
        const id = req.params.id;
        const { firstname, lastname, photo, idSport } = req.body;
        
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

        const legendeUpdate = await legendsModel.updateLegend(firstname, lastname, photo, idSport, id);
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

export default {
    getAllLegends,
    getLegendById,
    addLegend,
    updateLegend,
    deleteLegend
};