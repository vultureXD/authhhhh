const Image = require("../models/image.model.js");
const uploadToCloudinary = require("../helpers/cloudinary.helper.js");
const fs = require("fs");
const cloudinary = require("../config/cloudinary.js");

const uploadImageController = async (req, res) => {
    try {
        // chekc if file is missing in request object
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "File is required please upload an image",
            });
        }

        //upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        //store the image url and public id
        const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId,
        });

        await newImage.save();

        //delete the file from local storagge
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: "image uploaded successfully",
            image: newImage,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const fetchImageController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObject = {};
        sortObject[sortBy] = sortOrder;

        const images = await Image.find()
            .sort(sortObject)
            .skip(skip)
            .limit(limit);
        if (images) {
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Fetching images error",
        });
    }
};
const deleteImageController = async (req, res) => {
    try {
        const getCurrentImageId = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentImageId);

        if (!image) {
            res.status(404).json({
                success: false,
                message: "image not found",
            });
        }

        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "U are not authorized to delete this imagea",
            });
        }

        //delete this image first cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        //delete this image from mongodb database
        await Image.findByIdAndDelete(getCurrentImageId);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Deleting image error",
        });
    }
};
module.exports = {
    uploadImageController,
    fetchImageController,
    deleteImageController,
};
