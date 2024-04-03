import PostModel from "../models/postM.js";

const topThreeArticles = async (req, res) => {
    try {
        const threeArticles = await PostModel.find().sort({ views: -1 }).limit(3);

        if (!threeArticles || threeArticles.length === 0) {
            return res.status(404).json({ message: "Unable to find articles" });
        }

        return res.status(200).json({ message: "Top 3 articles fetched", data: threeArticles });
    } catch (error) {
        console.error("Error fetching top three articles:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const allArticles = async (req, res) => {
    try {
        const allArticles = await PostModel.find({}).sort({ createdAt: -1 });
        if (!allArticles || allArticles.length === 0) {
            return res.status(404).json({ message: "Unable to find articles" });
        }
        return res.status(200).json({ message: "All articles fetched", data: allArticles });
    } catch (error) {
        console.error("Error fetching all articles:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export { topThreeArticles, allArticles };
