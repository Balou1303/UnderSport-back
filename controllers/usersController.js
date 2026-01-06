import usersModel from "../models/usersModel.js"

export const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.fetchAllUsers();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des users" })
    }
}