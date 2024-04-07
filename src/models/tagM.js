import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const tagSchema = new Schema({
    tid: {
        type: String,
        default: () => uuidv4().slice(1, 7)
    },

    name: String,
    description: String,
    thumbnail: {
        name: String,
        path: String,
    },

}, { timestamps: true });

const TagModel = model("Tag", tagSchema);

export default TagModel;
