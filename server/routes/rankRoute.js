import express from 'express';
import authMiddleware from "../middleware/auth.js";
import { 
    addKeyword, 
    deleteKeyword, 
    getKeyword, 
    getKeywords, 
    refreshKeyword, 
    toggleTracking 
} from '../controllers/rankController.js';

const rankRouter = express.Router();

rankRouter.post('/add', authMiddleware, addKeyword);
rankRouter.get('/list', authMiddleware, getKeywords);
rankRouter.get('/:id', authMiddleware, getKeyword);
rankRouter.post('/:id/refresh', authMiddleware, refreshKeyword);
rankRouter.put('/:id/toggle', authMiddleware, toggleTracking);
rankRouter.delete('/:id', authMiddleware, deleteKeyword);

export default rankRouter;