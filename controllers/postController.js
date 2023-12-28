import PostModel from '../models/postM.js';



export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
    const limit = parseInt(req.query.limit) || 10; // Set a default limit or use the requested limit

    const startIndex = (page - 1) * limit;

    const posts = await PostModel.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await PostModel.countDocuments({});

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const addPost = async (req, res) => {
  try {
    console.log(req.file.filename);
    const { title, author, content, active } = req.body;

    // Create a new post based on the request body
    const newPost = new PostModel({ title, author, content, active });

    // Add file details to the post model if needed
    if (req.file) {
      newPost.thumbnail.filename = req.file.filename;
      newPost.thumbnail.path = req.file.path;
    }

    // Save the new post to the database
    const savedPost = await newPost.save();

    if (!savedPost) {
      return res.status(401).json({ message: "Unable to save post" });
    }

    res.status(201).json({ message: "New Post Added Successfully!", ...savedPost._doc });
  } catch (error) {
    console.error(`Error encountered while saving Post ---> ${error}`);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please input all fields" });
    }

    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
};



export const editPost = async (req, res) => {
  try {
    const slug = req.params.slug; // Corrected to use req.params.uuid
    const article = await PostModel.findOneAndUpdate({ slug: slug }, req.body, { new: true });

    // Check if the article with the given UUID exists
    if (!article) {
      return res.status(404).json({ message: "The Article Does not Exist!" });
    }

    res.status(200).json({ message: "Article Modified", ...article._doc });

  } catch (error) {
    console.error(`Error occurred while updating post: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deltePost = async (req, res) => {
  try {

    const postSlug = req.params.slug;


    const post = await PostModel.find({ slug: postSlug });
    if (!post) {
      return res.status(404).json({ message: "Article not found" });
    }

    await PostModel.deleteOne({ slug: postSlug });

    if (!post) {
      res.json({ message: "Error while Quering the Data for Delete" })
    }

    // Return a successful response
    res.status(200).json({ message: "Artcile deleted successfully" });
  }

  catch (error) {

    res.status(500).json({ message: "Internal Server Error", error: error })
  }
}