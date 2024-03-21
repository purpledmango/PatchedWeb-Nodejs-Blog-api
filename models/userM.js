import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    name: String, // No need to specify type separately
    bio: String, // No need to specify type separately
    profilePic: Buffer,
    userStatus: {
        type: Boolean,
        default: false,
    },
    group: {
        type: String,
        enum: ["Admin", "Staff", "User"],
        default: "User",
    },

    active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const UserModel = model("User", userSchema);

export default UserModel;
