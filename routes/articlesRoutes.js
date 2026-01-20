import express from 'express';
import articlesController from '../controllers/articlesController.js';
import checkToken from "../middleware/checkToken.js";
import checkEditor from "../middleware/checkEditor.js";
import checkAdmin from '../middleware/checkAdmin.js';

const router = express.Router();

router.get('/', articlesController.getAllArticles);
router.get('/:id', articlesController.getArticleById);
router.post('/', checkToken, checkEditor, articlesController.addArticle);
router.put('/:id', checkToken, checkEditor, articlesController.updateArticle);
router.delete('/:id', checkToken, checkAdmin, articlesController.deleteArticle);

export default router;