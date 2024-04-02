import { Router } from "express";
import { getAllPosts, addPost, editPost, deltePost, getPost, uploadThumbnail } from "../controllers/articleController.js";
import multer from 'multer';
import fs from 'fs';


// Upload Forder Exists?
const uploadFolder = 'uploads/';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
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
router.put("/add-thumbnail/:slug", upload.single("thumbnail"), uploadThumbnail)
router.put("/edit-post/:slug", editPost)
router.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', uploadFolder, filename);


  if (fs.existsSync(filePath)) {

    res.sendFile(filePath);
  } else {

    res.status(404).json({ message: 'File not found' });
  }
});




export default router;