import TagModel from "../models/tagM.js";

export const addTag = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newTag = new TagModel({ name, description });

        await newTag.save();

        res.status(201).json({ message: "Tag added successfully", data: newTag });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const delteTag = async (req, res) => {
    try {
        const { tid } = req.params;

        const tagExists = await TagModel.findOne({ tid });

        if (!tagExists) {
            res.status(404).json({ message: `Unabel to Find the Tag with id ${tid}` });
        }
        await PostModel.deleteOne({ tid });
        res.status(200).json({ message: `Deleted Tag with id ${tid}` })

    } catch (error) {

    }
}


export const updateTag = async (req, res) => {
    try {
        const { tid } = req.params;
        const { name, description } = req.body;

        const tagExists = await TagModel.findOne({ tid });

        if (!tagExists) {
            return res.status(404).json({ message: `Unable to find the Tag with id ${tid}` });
        }

        tagExists.name = name;
        tagExists.description = description;
        await tagExists.save();

        res.status(200).json({ message: `Tag with id ${tid} updated successfully`, tag: tagExists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTag = async (req, res) => {
    try {
        const { tid } = req.params;

        const tag = await TagModel.findOne({ tid });

        if (!tag) {
            return res.status(404).json({ message: `Unable to find the Tag with id ${tid}` });
        }

        res.status(200).json({ message: "Tag Data Fetched Successfully", data: tag });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
