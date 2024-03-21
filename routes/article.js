import { Router } from "express";
import { getAllPosts, addPost, editPost, deltePost, getPost } from "../controllers/postController.js";
import multer from 'multer';
import fs from 'fs';

// Ensure the 'uploads' folder exists
const uploadFolder = 'uploads/';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // Specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use unique filenames
  }
});

const upload = multer({ storage: storage });

const router = Router();

router.get('/posts', getAllPosts);
router.get('/get-post/:slug', getPost);
router.post('/add-post', addPost);
router.delete('/delete-post/:slug', deltePost)
router.put("/edit-post/:slug", editPost)
router.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', uploadFolder, filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Serve the file
    res.sendFile(filePath);
  } else {
    // File not found
    res.status(404).json({ message: 'File not found' });
  }
});




export default router;