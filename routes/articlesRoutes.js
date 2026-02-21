import express from 'express';
import articlesController from '../controllers/articlesController.js';
import checkToken from "../middleware/checkToken.js";
import checkEditor from "../middleware/checkEditor.js";
import checkAdmin from '../middleware/checkAdmin.js';
import multerConfig from '../middleware/multerConfig.js';


const router = express.Router();

router.get('/', articlesController.getAllArticles);
router.get('/dashboard', checkToken, checkEditor, articlesController.getDashboardArticles);
router.get('/popularity', checkToken, checkAdmin, articlesController.getPopularity);
router.get('/stats', checkToken, checkEditor, articlesController.getStats);
router.get('/:id', articlesController.getArticleById);
router.post('/', checkToken, multerConfig, checkEditor, articlesController.addArticle);
router.put('/:id', checkToken, multerConfig, checkEditor, articlesController.updateArticle);
router.delete('/:id', checkToken, checkAdmin, articlesController.deleteArticle);

router.get('/:idArticle/sports', articlesController.getSportsByArticle);
router.get('/filter/sports/:idSport', articlesController.getArticlesBySport);
router.post('/sports', checkToken, checkEditor, articlesController.addSportToArticle);
router.delete('/:idArticle/sports/:idSport', checkToken, checkEditor, articlesController.deleteSportFromArticle);

router.patch('/:id/featured', checkToken, checkAdmin, articlesController.defineFeatured);

export default router;