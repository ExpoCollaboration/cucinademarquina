import {registerAccount, getAllAccounts, loginAccount, getAccountById} from '../controllers/accountController.js';
import express from 'express';

const router = express.Router();

router.post('/login', loginAccount)
router.post('/register', registerAccount);
router.get('/accounts', getAllAccounts);
router.get('/account/:account_email', getAccountById);


export default router;
