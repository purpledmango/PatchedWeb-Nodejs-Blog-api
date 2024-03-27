import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuidv4().slice(1, 7)
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    name: String,
    bio: String,
    profilePic: {
        picName: String,
        picPath: String,
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
