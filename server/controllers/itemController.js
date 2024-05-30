// Define routes to use the controller functions
import Item from '../models/itemModel.js';

// Controller function to get all items
export const getAllItems = async(req, res) => {
    try {
        const response = await Item.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: "Internal Server Error " + error});
    }
}

// Controller function to get items by transactionId
export const getTransactionItemById = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const transaction = await Item.findAll({
            where: {
                transactionId: transactionId
            }
        });

        if (!transaction) {
            return res.status(404).json({ msg: "Transaction Item not found" });
        }

        res.json(transaction);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};