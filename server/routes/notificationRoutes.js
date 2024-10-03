import express from 'express';
import { body } from 'express-validator';
import { createNotification, getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  auth,

  [
    body('message').notEmpty().withMessage('Message is required'),
    body('recipients').isArray().withMessage('Recipients must be an array')
  ],
  createNotification
);

router.get('/', auth,  getNotifications);

router.put('/:id/read',auth, markNotificationAsRead);

export default router;