import PostModel from '../models/postM.js';


export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

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

export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await PostModel.findOne({ slug: slug });

    if (!article) {
      res.status(404).json({ message: "Article not Found" });
    }

    res.status(200).json({
      message: "Article Fetched",
      data: article
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addPost = async (req, res) => {
  try {

    const { title, author, content, active } = req.body;

    const newPost = new PostModel({ title, author, content, active });

    const savedPost = await newPost.save();

    if (!savedPost) {
      return res.status(401).json({ message: "Unable to save post" });
    }

    res.status(201).json({ message: "New Post Added Successfully!", data: savedPost });
  } catch (error) {
    console.error(`Error encountered while saving Post ---> ${error}`);

    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Please input all fields" });
    }

    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};



export const editPost = async (req, res) => {
  try {
    const slug = req.params.slug;

    const article = await PostModel.findOneAndUpdate({ slug: slug }, req.body, { new: true });

    if (!article) {
      return res.status(404).json({ message: "The Article Does not Exist!" });
    }

    res.status(200).json({ message: "Article Modified", data: article });

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

    res.status(200).json({ message: "Artcile deleted successfully" });
  }

  catch (error) {

    res.status(500).json({ message: "Internal Server Error", error: error })
  }
}

export const uploadThumbnail = async (req, res) => {
  try {
    const { slug } = req.params;
    const thumbnailFile = req.file;

    if (!thumbnailFile) {
      return res.status(400).json({ message: 'No thumbnail uploaded' });
    }

    const article = await PostModel.findOne({ slug });

    if (!article) {
      res.status(400).json({ message: "Sorry Unable to Find The article with that slug" })
    }

    article.thumbnail.filename = thumbnailFile.filename;
    article.thumbnail.path = thumbnailFile.path;


    await article.save();

    res.status(200).json({ message: 'Thumbnail uploaded successfully!' });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
    console.log(error)
  }
}