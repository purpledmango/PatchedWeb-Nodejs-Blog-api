import UserModel from "../models/userM.js";
import bcrypt from 'bcryptjs';
import authMiddleware from "../middlewares/authMiddleWare.js";
// import { store as sessionStore } from "../server.js"

// Handles the login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (req.session.user) {
      return res.status(400).json({ message: "User is already logged in!" });
    }

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "No Such Author Exists!" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return res.status(400).json({ message: "The Password is Incorrect!" });
    }

    const { password: userPassword, ...others } = user._doc;

    const userCookieInfo = {
      id: user._id, email: user.email, group: user.group
    }
    req.session.user = {
      ...userCookieInfo, authenticated: true
    };

    res.status(200).json({ message: "Successful Login", ...others });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}

// Handles the Logout
export const logout = async (req, res) => {
  try {
    // Check if the user is logged in or if there is an active session
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Destroy the session and log out the user
    req.session.destroy((err) => {
      if (err) {
        console.error("Error while destroying session:", err);
        return res.status(500).json({ message: "Error while Logging out" });
      }
      // Return a success message as the response
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "Logged out successfully!" });
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

// Gets the Author Info
export const getAuthorInfo = async (req, res) => {
  try {
    // 
    authMiddleware(req, res, async () => {
      // 
      const userUUID = await req.session.user.uuid;


      const userData = await UserModel.findOne({ uuid: userUUID });

      const { email, name, _id, group } = userData._doc


      res.status(200).json({ message: "Session", email, name, _id, group });
    });
  } catch (error) {
    // Handle errors by sending a 500 Internal Server Error response
    res.status(500).json(error);
  }
};

// Updates the Author Info
export const updateAuthorInfo = async (req, res) => {
  try {
    // The authMiddleware checks if the user is authenticated
    // If not authenticated, it will return a 401 Unauthorized response
    authMiddleware(req, res, async () => {
      const newData = req.body;

      const updatedUser = await UserModel.findOneAndUpdate({ email: req.session.user.email }, newData, { new: true });

      !updatedUser && res.status(404).json({ message: "User does not exist" });

      res.status(200).json(updatedUser);
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(req.body.password, salt);

    const newUser = new UserModel({
      email: req.body.email,
      passwordHash: hashed,
      name: req.body.name,
      bio: req.body.bio
    });

    const savedUser = await newUser.save();
    res.status(200).json({ message: "Signed Up Successfully!", ...savedUser._doc });

  } catch (err) {
    res.status(500).json({ message: err });
    throw (err);
  }
}

export const parseAuthorInfo = async (req, res) => {
  try {

    const user = await UserModel.findOne({ _id: req.body.id })

    const { passwordHash, ...others } = user._doc

    res.status(200).json({ message: "User Info Parsed", ...others })

  } catch (err) {
    res.status(500).json({ message: err });
    throw (err);
  }
}

export const deleteAuthor = async (req, res) => {
  try {
    if (req.session.user.group !== 'Admin') {
      return res.status(403).json({ message: 'You do not have the access required for that' });
    }

    const authorId = req.params.authorId; // Assuming you use "authorId" as the route parameter

    // Check if the author exists
    const existingAuthor = await UserModel.findById(authorId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Perform the deletion
    await UserModel.findByIdAndDelete(authorId);

    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllAuthors = async (req, res) => {
  try {
    authMiddleware(req, res, async () => {
      const authors = await UserModel.find({});
      console.log(authors)



      res.status(200).json({ message: "Authors Fetched", authors });
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}