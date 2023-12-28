import { Router } from "express";
import { getAllPosts, addPost, editPost, deltePost } from "../controllers/postController.js";
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
router.post('/add-post', upload.single('thumbnail'), addPost);
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



// // Show all post created by a specific author
// router.get('/author/all', async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: "Restricted access" });
//     }

//     const userId = req.session.user.author; // Assuming you have a session.user.author property

//     const articles = await PostModel.find({ author: userId }); // Assuming you use mongoose and .find() method

//     res.status(200).json({ articles });
//   } catch (err) {
//     res.status(500).json({ message: err });
//   }
// });





// add article Endpoint


// router.post("/add", async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: "Unauthorized Access" });
//     }
//     console.log("Validation Started")
//     // Validate the data
//     if (Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: 'Request body is empty or Invalid' });
//     }
//     console.log("Validation Completed")
//     // Create a new post based on the request body
//     const newPost = new PostModel(req.body);

//     try {
//       // Save the new post to the database
//       const savedPost = await newPost.save();
//       res.status(201).json({ message: "New Post Added Successfully!", post: savedPost });
//     } catch (error) {
//       console.log(`Error encountered while saving Post ---> ${error}`);
//       res.status(500).json({ message: "Error occurred while saving the post" });
//     }
//   } catch (err) {
//     console.log(`Error Caught while saving a new post -- ${err}`);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


// // update article Endpoint

// router.put("/update", async(req, res)=>{
//     try{
//         const article = await PostModel.findOneAndUpdate({slug:req.body.slug}, req.body, {new:true});
//         !article && res.status(404).json("The Article Does not Exist!");

//         res.status(200).json(article);

//     } catch (error) {
//         res.status(204).json(err);
//     }

// })

// // delete artcile Endpoint

// router.delete("/api/posts/:id", async (req, res) => {
//   
// });



export default router;