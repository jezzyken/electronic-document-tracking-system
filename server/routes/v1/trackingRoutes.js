const express = require("express");
const router = express.Router();
const { DocumentTracking } = require("../../models");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("attachments"), async (req, res) => {
  try {
    const tracking = new DocumentTracking(req.body);

    if (req.files && req.files.length > 0) {
      tracking.documents.attachments = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await uploadToCloudinary(
            file.path,
            file.originalname
          );
          return {
            title: file.originalname,
            fileUrl: uploadResult.url,
            fileType: uploadResult.format,
            fileSize: file.size,
            uploadedBy: req.body.sentBy,
            uploadedAt: new Date(),
          };
        })
      );
    }

    await tracking.save();
    res.status(201).json(tracking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:documentId", async (req, res) => {
  try {
    const tracking = await DocumentTracking.find({
      documentId: req.params.documentId,
    })
      .populate("fromDepartment.department")
      .populate("toDepartment.department")
      .populate("trackingOfficer.user");
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tracking = await DocumentTracking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tracking) {
      return res.status(404).json({ error: "Tracking record not found" });
    }
    res.json(tracking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tracking = await DocumentTracking.findByIdAndDelete(req.params.id);
    if (!tracking) {
      return res.status(404).json({ error: "Tracking record not found" });
    }

    if (tracking.documents.attachments.length > 0) {
      for (const attachment of tracking.documents.attachments) {
        const publicId = attachment.fileUrl
          .split("/")
          .slice(-1)[0]
          .split(".")[0];
        await deleteFromCloudinary(publicId);
      }
    }

    res.json({ message: "Tracking record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
