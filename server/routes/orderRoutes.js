import express from 'express';
import {getAllOrders, getTransactionsItems, saveTransactionAndItems} from '../controllers/orderController.js';
const router = express.Router();

// Route to get all orders
router.get('/', getAllOrders);

// Route to get the tranactionItems by ID
router.get('/:transactionId', getTransactionsItems); 

// Route to create new order with transaction and items
router.post('/', saveTransactionAndItems);

export default router;