import { Router } from 'express';
import { login, logout, register, parseAuthorInfo } from '../controllers/userController.js'

const router = Router();

// Endpoints

router.post('/register', register);

router.post('/login', login)

router.post('/parse-author', parseAuthorInfo);

router.post('/logout', logout);


export default router;
