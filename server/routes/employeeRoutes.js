import express from 'express';
import { body } from 'express-validator';
import { getAllEmployees, addEmployee } from '../controllers/employeeController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllEmployees);

router.post(
  '/',

  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('name').notEmpty().withMessage('Name is required')
  ],
  addEmployee
);

export default router;
