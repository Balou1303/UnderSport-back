import championshipsModel from "../models/championshipsModel.js"

const getAllChampionships = async (req, res) => {
    try {
        const allChampionships = await championshipsModel.fetchAllChampionships()
        res.status(200).json(allChampionships)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des championnats" });
    };
};

const getChampionShipsById = async (req, res) => {
    try {
        const id = req.params.id;
        const championshipById = await championshipsModel.fetchChampionshipById(id);

        if (!championshipById) {
            return res.status(404).json({ message: "Championnat non trouvé" });
        }
        res.status(200).json(championshipById)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du championnat" });
    };
};

const addChampionShip = async (req, res) => {
    try {
        const { name, idSport } = req.body;

        let logo = null;
        if (req.file) {
            logo = `/images/${req.file.filename}`;
        }

        if (!name || !idSport) {
            res.status(400).json({ message: "Le champ est obligatoire" });
            return;
        };
        const existingTeams = await championshipsModel.fetchExistingChampionship(name, idSport);
        if (existingTeams) {
            res.status(409).json({ message: "Le championnat existe déja" });
            return;
        };

        await championshipsModel.createChampionship(name, logo, idSport);
        res.status(201).json({ message: "Championnat créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du championnat" });
    };
};

const updateChampionship = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, idSport } = req.body;

        let logo = req.body.logo; // Par défaut, on garde l'ancien logo
        if (req.file) {
            // Si un nouveau fichier est uploadé, on remplace le chemin
            logo = `/images/${req.file.filename}`; 
        }

        if (!name || !idSport) {
            res.status(400).json({ message: 'Un championnat et un sport sont obligatoires' });
            return;
        };

        const existingChampionship = await championshipsModel.fetchExistingChampionship(name, idSport);

        if (existingChampionship && existingChampionship.championshipId != id) {
            return res.status(409).json({ message: "Le nom existe déjà" });
        };
        const championshipUpdate = await championshipsModel.updateChampionship(name, logo, idSport, id);
        if (championshipUpdate.affectedRows === 0) {
            res.status(404).json({ message: "Championnat non trouvé" });
        } else {
            res.status(200).json({ message: "Championnat mis à jour avec succès" });
        }

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

const deleteChampionship = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await championshipsModel.deleteChampionship(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Championnat non trouvé" });
        } else {
            res.status(200).json({ message: "Championnat supprimé avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du championnat" });
    }
};

const championshipBySportId = async (req, res) => {
    try {
        const id = req.params.idSport;
        const result = await championshipsModel.fetchChampionshipsBySportId(id);
        
        res.status(200).json(result); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du championnat par sport" })
    }
}

export default {
    getAllChampionships,
    getChampionShipsById,
    addChampionShip,
    updateChampionship,
    deleteChampionship,
    championshipBySportId
}