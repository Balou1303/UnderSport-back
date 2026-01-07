import usersModel from "../models/usersModel.js"
import bcrypt from 'bcryptjs';

const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.fetchAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des users" });
    };
};

const getUsersById = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = await usersModel.fetchUsersById(id);

        if (userId) {
            res.status(200).json(userId);
        } else {
            res.status(404).json({ message: "Users non trouvé" });
        };
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'user" });
    }
};

const addUsers = async (req, res) => {
    try {
        const { nickname, email, password, firstName, lastName, picture } = req.body;

        if (!nickname || !email || !password) {
            res.status(400).json({ message: 'Les champs sont obligatoires' });
            return;
        }

        const existingUser = await usersModel.fetchExistingUsers(email, nickname);
        if (existingUser) {
            return res.status(409).json({ message: "L'email ou le nickname existe déjà" });
        };

        const passwordHash = bcrypt.hashSync(password, 10);
        const createUsers = await usersModel.addUser(nickname, email, passwordHash, firstName, lastName, picture)
        res.status(201).json({ message: 'User créé avec succès !' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'user" });
    };
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { nickname, email, firstName, lastName, picture } = req.body;

        if (!nickname || !email) {
            res.status(400).json({ message: 'Les champs nickname et email sont obligatoires' });
            return;
        }

        const existingUser = await usersModel.fetchExistingUsers(email, nickname);

        if (existingUser && existingUser.userId != id) {
            return res.status(409).json({ message: "L'email ou le nickname existe déjà" });
        };

        const userUpdate = await usersModel.updateUser(id, nickname, email, firstName, lastName, picture);
        if (userUpdate.affectedRows === 0) {
            res.status(404).json({ message: 'Users non trouvé' });
        } else {
            res.status(200).json({ message: "User mis à jour" })
        }

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de l'user" });
    }
}

const updatePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'Le nouveau mot de passe est obligatoire' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const result = await usersModel.updatePassword(id, hashedPassword);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "user non trouvé" });
        } else {
            res.status(200).json({ message: "Mot de passe modifié avec succès !" });
        }

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification du mot de passe", });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userDelete = await usersModel.deleteUser(id)

        if (userDelete.affectedRows === 0) {
            res.status(404).json({message: "users non trouvé"})
        } else {
            res.status(200).json({message: 'User supprimmé'})
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'user", });
    }
}

export default {
    getAllUsers,
    getUsersById,
    addUsers,
    updateUser,
    updatePassword,
    deleteUser
}