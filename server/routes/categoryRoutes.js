import {
    getAllCategory,
    saveCategory,
    getCategoryById
} from '../controllers/categoryController.js';
import express from 'express';

const router = express.Router();

router.get('/', getAllCategory);
router.post('/', saveCategory);
router.get('/:id', getCategoryById);

export default router;