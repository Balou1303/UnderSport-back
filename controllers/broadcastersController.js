import broadcastersModel from "../models/broadcastersModel.js";

const getAllBroadcasters = async (req, res) => {
    try {
        const broadcasters = await broadcastersModel.fetchAllBroadcasters();
        res.status(200).json(broadcasters);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récup des diffuseurs" });
    }
};

const getBroadcasterById = async (req, res) => {
    try {
        const id = req.params.id;
        const broadcaster = await broadcastersModel.fetchBroadcasterById(id);

        if (!broadcaster) {
            return res.status(404).json({ message: "Diffuseur non trouvé" });
        }

        res.status(200).json(broadcaster);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const addBroadcaster = async (req, res) => {
    try {
        const { name, logo } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Le nom du diffuseur est obligatoire" });
        }

        const existingBroadcaster = await broadcastersModel.fetchBroadcasterByName(name);

        if (existingBroadcaster) {
            return res.status(409).json({ message: "Ce diffuseur existe déjà" });
        }

        const newBroadcaster = await broadcastersModel.createBroadcaster(name, logo);
        res.status(201).json({ message: "Diffuseur créé", id: newBroadcaster.insertId });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création" });
    }
};

const updateBroadcaster = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, logo } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Le nom du diffuseur est obligatoire" });
        }

        const broadcasterToUpdate = await broadcastersModel.fetchBroadcasterById(id);
        if (!broadcasterToUpdate) {
            return res.status(404).json({ message: "Diffuseur non trouvé" });
        }

        const checkNameConflict = await broadcastersModel.fetchBroadcasterByName(name);
        if (checkNameConflict && checkNameConflict.broadcasterId !== parseInt(id)) {
            return res.status(409).json({ message: "Ce nom de diffuseur est déjà utilisé par une autre chaîne" });
        }

        const broadcasterUpdate = await broadcastersModel.updateBroadcaster(name, logo, id);
        res.status(200).json({ message: "Diffuseur mis à jour" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du diffuseur" });
    }
};

const deleteBroadcaster = async (req, res) => {
    try {
        const id = req.params.id;
        
        const result = await broadcastersModel.deleteBroadcaster(id);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Diffuseur non trouvé" });
        } else {
            res.status(200).json({ message: "Diffuseur supprimé" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du diffuseur" });
    }
};

export default {
    getAllBroadcasters,
    getBroadcasterById,
    addBroadcaster,
    updateBroadcaster,
    deleteBroadcaster
};