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
        unique: [true, "Post with Same Title Exists"]

    },
    body: String,
    thumbnail: {
        filename: { type: String },
        path: { type: String }
    },
    author: {
        type: ObjectId,
        ref: "Users",
        required: true,
    },
    meta_tags: StringArray,
    meta_keywords: StringArray,
    active: {
        type: Boolean,
        default: false,
    },
    relatedPosts: [{
        type: ObjectId,
        ref: "Articles",
    }],
    views: {
        default: 0,
        type: Number
    }
}, { timestamps: true });

PostSchema.pre("save", async function (next) {
    // Generate the slug from the title
    this.slug = slug(this.title);

    // Check for existing slugs
    const similarSlugs = await this.constructor.find({ slug: new RegExp(`^${this.slug}(-([0-9]+))?`, 'i') });
    if (similarSlugs.length > 0) {
        const slugCount = similarSlugs.length + 1;
        this.slug = `${this.slug}-${slugCount}`;
    }

    // If the thumbnail is not set and a file is uploaded, set the thumbnail property
    if (!this.thumbnail.filename && this.thumbnail.path) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = this.thumbnail.filename.split('.').pop();
        this.thumbnail.filename = `thumbnail-${uniqueSuffix}.${extension}`;
    }

    next();
});

const PostModel = model("Articles", PostSchema);

export default PostModel;
