import usersModel from "../models/usersModel.js"; // Import adapté à ton 'export default'
import bdd from '../config/bdd.js'; // Ton fichier de connexion
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Groupe de test
describe('Test CRUD usersModel', () => {

    // Connexion avant les tests
    beforeAll(async () => {
        try {
            // avec un Pool, la connexion est souvent automatique,
            // mais on garde ça pour vérifier que la BDD répond bien.
            await bdd.getConnection();
        } catch (error) {
            console.error(' Erreur de connexion BDD', error);
        }
    });

    // Le test de fetchAllUsers
    it('should return users info', async () => {

        // arrange (Pas de variables à préparer pour fetchAll)

        // act
        const result = await usersModel.fetchAllUsers();

        // assert (On vérifie)
        expect(result).toBeDefined(); // Est-ce que ça existe ?
        expect(Array.isArray(result)).toBe(true); // Est-ce que c'est un tableau ?

        // on vérifie que les noms de colonnes sont bons
        expect(result[0]).toHaveProperty('userId');
        expect(result[0]).toHaveProperty('nickname');
        expect(result[0]).toHaveProperty('email');
        expect(result[0]).toHaveProperty('idRole');
    });

    // test de fetchUsersById
    it('should return users infos by his id', async () => {
        // arrange
        const userId = 1; // On sait que l'ID 1 existe (SuperAdmin)

        // act
        const userById = await usersModel.fetchUsersById(userId);

        // assert
        expect(userById).toBeDefined();
        expect(userById).toHaveProperty('userId', 1); // On vérifie que c'est bien l'ID 1
        expect(userById).toHaveProperty('nickname');  // On vérifie qu'il a un pseudo
        expect(userById.email).toContain('@');        // Petite vérif que l'email ressemble à un email
    });

    // test si users n'existe pas
    it("should return undefined if user doesn't exist", async () => {
        // arrange
        const idUnknown = 999999; // Un ID improbable

        // act
        const result = await usersModel.fetchUsersById(idUnknown);

        // assert
        expect(result).toBeUndefined();
    });

    // test de createUser
    // it('should create a new user', async () => {
    //     const result = await usersModel.addUser(
    //         'VitestNick',      // nickname
    //         'email@test.com',  // email unique
    //         'password123',     // password
    //         'John',            // firstName
    //         'Doe',             // lastName
    //         'avatar.jpg'       // picture
    //     );

    //     expect(result).toBeDefined();
    //     expect(result).toHaveProperty('insertId');

    //     // IMPORTANT : On sauvegarde l'ID pour les prochains tests !
    //     userIdTest = result.insertId;
    // });

    // test de updateUser pour l'ID 4
    // it('should update user with ID 4', async () => {
    //     // 1. On définit l'ID qu'on veut cibler
    //     const targetId = 4;

    //     // 2. On définit les données (obligatoire car ta fonction updateUser attend tout)
    //     // On garde les mêmes pour ne pas casser l'unicité, on change juste le nom/prénom.
    //     const currentNickname = 'VitestNick'; 
    //     const currentEmail = 'email@test.com';

    //     const newFirstName = 'Jean-Modifié';
    //     const newLastName = 'Update4';
    //     const newPicture = 'new_avatar.jpg';

    //     // 3. On lance la modification
    //     const result = await usersModel.updateUser(
    //         targetId, 
    //         currentNickname,
    //         currentEmail, 
    //         newFirstName, 
    //         newLastName, 
    //         newPicture
    //     );

    //     // 4. Vérification
    //     expect(result.affectedRows).toBe(1); // Doit modifier 1 ligne

    //     // 5. Vérification des données
    //     const updatedUser = await usersModel.fetchUsersById(targetId);
    //     expect(updatedUser.firstName).toBe('Jean-Modifié');
    //     expect(updatedUser.lastName).toBe('Update4');
    // });

    // Test de deleteUser pour l'ID 4
    // it('should delete user with ID 4', async () => {
    //     // ID à supprimer
    //     const targetId = 4;

    //     // On lance la suppression
    //     const result = await usersModel.deleteUser(targetId);

    //     // Vérification : une ligne a été touchée
    //     expect(result.affectedRows).toBe(1);

    //     // On essaie de récupérer l'utilisateur pour vérifier qu'il a bien été supprimé
    //     // fetchUsersById doit renvoyer undefined
    //     const deletedUser = await usersModel.fetchUsersById(targetId);
    //     expect(deletedUser).toBeUndefined();
    // });

    // Nettoyage après les tests
    afterAll(async () => {
        try {
            await bdd.end(); // Très important pour arrêter le test proprement
        } catch (error) {
            console.error('Erreur fermeture', error);
        }
    });

});