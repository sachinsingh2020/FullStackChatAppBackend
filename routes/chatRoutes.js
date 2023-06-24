import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from '../controllers/chatController.js';


const router = express.Router();

router.route('/access').post(isAuthenticated, accessChat);
router.route('/access').get(isAuthenticated, fetchChats);
router.route('/group').post(isAuthenticated, createGroupChat);
router.route('/rename').put(isAuthenticated, renameGroup);
router.route('/groupadd').put(isAuthenticated, addToGroup);
router.route('/groupremove').put(isAuthenticated, removeFromGroup);




export default router;
