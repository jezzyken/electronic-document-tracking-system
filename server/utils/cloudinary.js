const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// utils/cloudinary.js

const uploadToCloudinary = async (filePath, originalname) => {
  try {
    const fileExt = originalname.split('.').pop().toLowerCase();
    
    let resourceType = 'raw'; // default
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExts = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
    
    if (imageExts.includes(fileExt)) {
      resourceType = 'image';
    } else if (videoExts.includes(fileExt)) {
      resourceType = 'video';
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: "documents",
      use_filename: true,
      unique_filename: true
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType,
      format: fileExt
    };
  } catch (error) {
    // Clean up local file if upload fails
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });
    throw new Error(`Error uploading to Cloudinary: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting from Cloudinary: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};