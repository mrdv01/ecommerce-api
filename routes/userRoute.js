import express from 'express'
import { getUserProfileCtrl, loginUserCtrl, registerUserCtrl, updateShippingAddressctrl } from '../controllers/usersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post('/login', loginUserCtrl);
userRoutes.get('/profile', isLoggedIn, getUserProfileCtrl);
userRoutes.post('/update/shipping', isLoggedIn, updateShippingAddressctrl);

export default userRoutes;