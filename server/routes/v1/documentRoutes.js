const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../../models/Document");
const { auth, authorize } = require("../../middleware/authMiddleware");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require('cloudinary').v2;
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  getDownloadUrl
} = require("../../utils/cloudinary");
const axios = require("axios")

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// routes/documents.js

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    const uploadResult = await uploadToCloudinary(
      req.file.path,
      req.file.originalname
    );

    const doc = new Document({
      name: req.body.name,
      department: req.body.department,
      fileUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      fileType: uploadResult.resourceType,
      fileFormat: uploadResult.format,
      uploadedBy: req.user._id,
    });

    await doc.save();

    const populatedDoc = await Document.findById(doc._id)
      .populate("uploadedBy", "username email department")
      .populate("updatedBy", "username email department");

    res.json(populatedDoc);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const { department } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role.name;

    console.log(userRole);

    let filter = {};

    if (userRole !== "Admin") {
      filter = {
        $or: [
          { uploadedBy: new ObjectId(userId) },
          department
            ? { department: department }
            : { uploadedBy: new ObjectId(userId) },
        ],
      };
    }

    const docs = await Document.find(filter)
      .sort("-createdAt")
      .populate("uploadedBy", "username email department")
      .populate("updatedBy", "username email department");

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("uploadedBy", "username email department")
      .populate("updatedBy", "username email department");
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/download", async (req, res) => {

  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    // Generate signed URL for raw file
    const timestamp = Math.floor(Date.now() / 1000);
    const signedUrl = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      public_id: doc.cloudinaryPublicId,
      resource_type: 'raw'
    }, process.env.CLOUDINARY_API_SECRET);

    const downloadUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/s--${signedUrl}--/${doc.cloudinaryPublicId}`;

    console.log(downloadUrl)

    res.json({ signedUrl: downloadUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  
  //   const doc = await Document.findById(req.params.id);

  //   console.log(doc)

  //   return

  // const downloadUrl = await getDownloadUrl(publicId, 'raw');

  // try {
  //   const doc = await Document.findById(req.params.id);
  //   if (!doc) return res.status(404).json({ error: "Document not found" });

  //   // Generate signed URL for raw file
  //   const timestamp = Math.floor(Date.now() / 1000);
  //   const signedUrl = cloudinary.utils.api_sign_request({
  //     timestamp: timestamp,
  //     public_id: doc.cloudinaryPublicId,
  //     resource_type: 'raw'
  //   }, process.env.CLOUDINARY_API_SECRET);

  //   const downloadUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/s--${signedUrl}--/${doc.cloudinaryPublicId}`;

  //   res.json({ signedUrl: downloadUrl });
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }

  // try {
  //   const doc = await Document.findById(req.params.id);
  //   if (!doc) return res.status(404).json({ error: "Document not found" });

  //   // Generate signed URL with Cloudinary
  //   const signedUrl = cloudinary.utils.private_download_url(doc.cloudinaryPublicId, 
  //     doc.fileFormat, {
  //       expiresAt: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
  //       resource_type: 'raw'
  //   });

  //   console.log('Signed URL:', signedUrl);

  //   const response = await axios({
  //     method: "get",
  //     url: signedUrl,
  //     responseType: "arraybuffer"
  //   });

  //   res.setHeader("Content-Type", "application/octet-stream");
  //   res.setHeader(
  //     "Content-Disposition",
  //     `attachment; filename="${encodeURIComponent(doc.name)}.${doc.fileFormat}"`
  //   );

  //   res.send(response.data);
  // } catch (err) {
  //   console.error('Download error:', {
  //     message: err.message,
  //     stack: err.stack
  //   });
  //   res.status(500).json({ error: err.message });
  // }
});

// router.get("/:id/download", async (req, res) => {
//   try {
//     const doc = await Document.findById(req.params.id);
//     if (!doc) return res.status(404).json({ error: "Document not found" });
//     res.download(doc.fileUrl, doc.name);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: status,
          remarks: remarks,
          updatedBy: req.user._id,
        },
      },
      { new: true }
    )
      .populate("uploadedBy", "username email department")
      .populate("updatedBy", "username email department");

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (doc.cloudinaryPublicId) {
      await deleteFromCloudinary(doc.cloudinaryPublicId);
    }

    await Document.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
