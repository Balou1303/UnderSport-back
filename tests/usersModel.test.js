import usersModel from "../models/usersModel.js"; 
import bdd from '../config/bdd.js'; 
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Test CRUD usersModel', () => {

    let userIdTest;
    // On crée un identifiant unique basé sur l'heure pour éviter l'erreur "Duplicate entry"
    const uniqueId = Date.now(); 
    const uniqueNickname = `VitestNick_${uniqueId}`;
    const uniqueEmail = `test_${uniqueId}@test.com`;

    beforeAll(async () => {
        try {
            await bdd.getConnection();
        } catch (error) {
            console.error('Erreur BDD', error);
        }
    });

    it('should return users info', async () => {
        const result = await usersModel.fetchAllUsers();
        expect(result).toBeDefined(); 
        expect(result[0]).toHaveProperty('userId');
    });

    it('should return users infos by his id', async () => {
        const userId = 1; 
        const userById = await usersModel.fetchUsersById(userId);
        expect(userById).toBeDefined();
        expect(userById).toHaveProperty('userId', 1); 
    });

    it("should return undefined if user doesn't exist", async () => {
        const idUnknown = 999999; 
        const result = await usersModel.fetchUsersById(idUnknown);
        expect(result).toBeUndefined();
    });

    it('should create a new user dynamically', async () => {
        // On utilise nos variables dynamiques
        const result = await usersModel.addUser(
            uniqueNickname,     
            uniqueEmail, 
            'password123',     
            'John',            
            'Doe',             
            'avatar.jpg'       
        );

        expect(result).toBeDefined();
        expect(result).toHaveProperty('insertId');

        // On sauvegarde l'ID fraîchement généré
        userIdTest = result.insertId;
    });

    it('should update the newly created user', async () => {
        const targetId = userIdTest;
        const newFirstName = 'Jean-Modifié';

        const result = await usersModel.updateUser(
            targetId,
            uniqueNickname,
            uniqueEmail,
            newFirstName,
            'UpdateTest',
            'new_avatar.jpg'
        );

        expect(result.affectedRows).toBe(1); 
    });

    it('should delete the newly created user', async () => {
        const targetId = userIdTest;
        const result = await usersModel.deleteUser(targetId);

        expect(result.affectedRows).toBe(1);
    });

    afterAll(async () => {
        try {
            await bdd.end(); 
        } catch (error) {
            console.error('Erreur fermeture', error);
        }
    });
});