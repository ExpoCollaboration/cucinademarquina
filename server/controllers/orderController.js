// Define routes to use the controller functions
import Transaction from '../models/transactionModel.js'; 
import Item from '../models/itemModel.js';


// Controller function to get all orders
export const getAllOrders = async (req, res) => {
    try {
        const response = await Transaction.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Controller function to get a table, transaction, and items by ID
export const getTransactionsItems = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const transaction = await Transaction.findOne({
            where: {
                transactionId: transactionId
            }
        });

        const items = await Item.findAll({
            where: {
                transactionId: transactionId
            }
        });

        if (!transaction) {
            return res.status(404).json({ msg: "Transaction not found" });
        }

        res.json({transaction, items});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Internal Server Error" + error});
    }
};


// Controller function to save a new transaction and its associated items
export const saveTransactionAndItems = async (req, res) => {
    try {
        const { transactionData, itemData } = req.body;

        if (!transactionData || !itemData) {
            return res.status(400).json({ error: 'Transaction data and item data are required.' });
        }

        // Create a new transaction instance
        const newTransaction = await Transaction.create({
            accountId: transactionData.accountId,
            transactionId: transactionData.transactionId,
            fullName: transactionData.fullName,
            overallTotal: transactionData.overallTotal,
        });

        // Save items associated with the transaction
        const promises = itemData.map(async (item) => {
            await Item.create({
                transactionId: item.transactionId,
                name: item.name,
                category: item.category,
                price: item.price,
                quantity: item.quantity,
                total: item.total
            });
        });

        await Promise.all(promises);

        return res.status(201).json({ message: 'Transaction and items saved successfully.', transactionId: newTransaction.id });
    } catch (error) {
        console.error('Error saving transaction and items:', error);
        return res.status(500).json({ error: 'Failed to save transaction and items.', details: error.message });
    }
};