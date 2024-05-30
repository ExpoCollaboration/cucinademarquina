import {
    getAllCategory,
    saveCategory,
    getCategoryById
} from '../controllers/CategoryController.js';
import express from 'express';

const router = express.Router();

router.get('/', getAllCategory);
router.post('/', saveCategory);
router.get('/:id', getCategoryById);

export default router;