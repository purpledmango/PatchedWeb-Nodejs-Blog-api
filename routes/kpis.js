import { Router } from "express";
import PostModel from "../models/postM.js";
import slug from 'slug';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

//GET - Published Articles
router.get('/published', async (req, res) => {
    try {
        const publishedPosts = await PostModel.find({ active: true }).sort({ createdAt: -1 });

        if (!publishedPosts || publishedPosts.length === 0) {
            res.status(404).json({ message: "No published posts found" });
            return;
        }

        res.status(200).json({ message: "Published posts fetched", data: publishedPosts });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// GET - Drafts
router.get('/drafts', async (req, res) => {
    try {
        const drafts = await PostModel.find({ active: false }).sort({ createdAt: -1 });

        if (!drafts || drafts.length === 0) {
            res.status(404).json({ message: "No drafts found" });
            return;
        }

        res.status(200).json({ message: "Drafts fetched", data: drafts });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// GET - Total Views
router.get('/views', async (req, res) => {
    try {
        const viewsResult = await PostModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            }
        ]);

        if (!viewsResult || viewsResult.length === 0) {
            res.status(404).json({ message: "No views data found" });
            return;
        }

        const totalViews = viewsResult[0].totalViews;

        res.status(200).json({ message: "Total views fetched", data: { totalViews } });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// POST - Create a new post
router.post('/create', async (req, res) => {
    try {
        const { title, body, author, meta_tags, meta_keywords } = req.body;

        const newPost = new PostModel({
            title,
            body,
            author,
            meta_tags,
            meta_keywords,
            active: false, // Assuming a new post is initially not active
        });

        const savedPost = await newPost.save();

        res.status(201).json({ message: "Post created successfully", data: savedPost });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// PUT - Update post by ID
router.put('/update/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(postId, req.body, { new: true });

        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.status(200).json({ message: "Post updated successfully", data: updatedPost });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// GET - Top 10 Most Viewed Articles
router.get('/top-articles', async (req, res) => {
    try {
        const topArticles = await PostModel.aggregate([
            { $sort: { views: -1, createdAt: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    slug: 1,
                    body: 1,
                    author: 1,
                    meta_tags: 1,
                    meta_keywords: 1,
                    active: 1,
                    relatedPosts: 1,
                    views: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        if (!topArticles || topArticles.length === 0) {
            res.status(404).json({ message: "No top articles found" });
            return;
        }

        res.status(200).json({ message: "Top articles fetched", data: topArticles });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
export default router;
