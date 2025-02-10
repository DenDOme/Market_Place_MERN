import express from 'express';
import { changeCategory, createCategory, deleteCategory, getCategories, getOneCategory } from '../controllers/category.controller';


const router = express.Router();

router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.get('/categories/:id', getOneCategory);
router.put('/categories/:id', changeCategory);
router.delete('/categories/:id', deleteCategory);

export default router;