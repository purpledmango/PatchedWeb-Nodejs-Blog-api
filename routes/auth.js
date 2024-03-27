import { Router } from 'express';
import { login, logout, register, parseAuthorInfo } from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleWare.js';

const router = Router();

// Endpoints

router.post('/register', register);

router.post('/login', login)

router.post('/parse-author', authMiddleware, parseAuthorInfo);

router.post('/logout', logout);



export default router;
