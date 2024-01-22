import { Router } from 'express';
import UserModel from '../models/userM.js';

const router = Router();

// Endpoints

router.get("/get-name/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        console.log(uid);

        // Corrected: Use await to wait for the asynchronous operation
        const user = await UserModel.findById(uid);

        if (!user) {
            // Corrected: Change the status code to 404 when user is not found
            return res.status(404).json({ message: "User not found" });
        }

        // Corrected: Use user.toObject() to convert Mongoose document to plain JavaScript object
        res.status(200).json({ message: "User's Name has been fetched", data: { user: user._doc } });
    } catch (error) {
        // Corrected: Use return to prevent sending a response after an error
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export default router;
