import express from 'express';
import commentsController from '../controllers/commentsController.js';
import checkToken from "../middleware/checkToken.js";
import checkEditor from "../middleware/checkEditor.js"; 

const router = express.Router();

router.get('/', checkToken, checkEditor, commentsController.getAllComments);
router.get('/article/:id', commentsController.getCommentsByArticle);
router.post('/', checkToken, commentsController.addComment);
router.put('/:id', checkToken, commentsController.updateComment);
router.delete('/:id', checkToken, commentsController.deleteComment);

export default router;

