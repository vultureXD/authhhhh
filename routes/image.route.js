const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const adminMiddleware = require("../middleware/admin.middleware.js");
const uploadMiddleware = require("../middleware/upload.middleware.js");

const {
    uploadImageController,
    fetchImageController,
    deleteImageController,
} = require("../controllers/image.controller.js");

const router = express.Router();

//upload the image
router.post(
    "/upload",
    authMiddleware,
    adminMiddleware,
    uploadMiddleware.single("image"),
    uploadImageController,
);

//get all images
router.get("/get", authMiddleware, fetchImageController);

//delete image
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;
