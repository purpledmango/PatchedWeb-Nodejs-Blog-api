import { Router } from 'express';
import { login, logout, getAuthorInfo, updateAuthorInfo, register, parseAuthorInfo, deleteAuthor, getAllAuthors, } from '../controllers/userController.js'

const router = Router();

// Endpoints

router.post('/register', register);

router.post('/login', login)

router.post('/parse-author', parseAuthorInfo);

router.post('/logout', logout);

router.put("/update-user", updateAuthorInfo);

router.get("/get-user", getAuthorInfo);

router.delete("/delete-user/:authorId", deleteAuthor);

router.get("/get-authors", getAllAuthors);

export default router;
