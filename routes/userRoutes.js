import express from 'express';
import { getMe, getUsers, loginUser, logout, registerUser } from '../controllers/userController.js';
import singleUpload from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';


const router = express.Router();

router.route('/register').post(singleUpload, registerUser);

router.route('/login').post(loginUser);

router.route('/getusers').get(isAuthenticated, getUsers);

router.route('/me').get(isAuthenticated, getMe)

router.route('/logout').get(logout);


export default router;