import { Schema, model } from "mongoose";
import slug from 'slug';
import { v4 as uuidv4 } from 'uuid';

const ObjectId = Schema.Types.ObjectId;
const StringArray = {
    type: [String],
    default: [],
};

const PostSchema = Schema({
    uuid: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: [true, "Post with Same Title Exists"],

    },
    content: String,
    thumbnail: {
        filename: { type: String },
        path: { type: String },
    },
    author: {
        type: String, // Assuming the uid is a string
        ref: "User", // Reference to the User model
    },
    meta_tags: StringArray,
    meta_keywords: StringArray,
    active: {
        type: Boolean,
        default: false,
    },
    // relatedPosts: [{
    //   type: ObjectId,
    //   ref: "Article", // Assuming your Article model is named "Article"
    // }],
    views: {
        default: 0,
        type: Number,
    },
}, { timestamps: true });

// Mongoose middleware to handle slug generation only for new documents
PostSchema.pre('save', async function (next) {
    // Check if the document is new (isNew property)
    if (this.isNew) {
        // Generate the slug from the title
        this.slug = slug(this.title);

        // Check for existing slugs (case-insensitive)
        const similarSlugs = await this.constructor.find({ slug: new RegExp(`^${this.slug}(-([0-9]+))?`, 'i') });
        if (similarSlugs.length > 0) {
            const slugCount = similarSlugs.length + 1;
            this.slug = `${this.slug}-${slugCount}`;
        }
    }

    next();
});

const PostModel = model("Article", PostSchema); // Changed model name to "Article"

export default PostModel;
