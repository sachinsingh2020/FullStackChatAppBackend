import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { allMessages, fetchAllMessages, seenAllMessagesFromChat, seenMessage, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.route('/send').post(isAuthenticated, sendMessage);

router.route('/allmsg/:chatId').get(isAuthenticated, allMessages);

router.route('/seen').put(isAuthenticated, seenMessage);

router.route('/seenall').put(isAuthenticated, seenAllMessagesFromChat);

router.route('/fetchallmessages').get(isAuthenticated, fetchAllMessages);


export default router;
