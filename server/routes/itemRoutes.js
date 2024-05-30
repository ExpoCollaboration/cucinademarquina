import express from 'express';
import {getAllItems, getTransactionItemById} from '../controllers/itemController.js';
const router = express.Router();

// Route to get all items
router.get('/', getAllItems);

// Route to get items by transaction ID
router.get('/:transactionId', getTransactionItemById);

export default router