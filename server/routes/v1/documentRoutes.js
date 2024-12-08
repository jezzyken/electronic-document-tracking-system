const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../../models/Document");
const { auth, authorize } = require("../../middleware/authMiddleware");
const ObjectId = require("mongoose").Types.ObjectId;

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

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    const doc = new Document({
      name: req.body.name,
      department: req.body.department,
      fileUrl: req.file.path,
      uploadedBy: req.user._id,
    });

    await doc.save();
    const populatedDoc = await Document.findById(doc._id)
      .populate("uploadedBy", "username email department")
      .populate("updatedBy", "username email department");
    res.json(populatedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { department } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role.name;

    console.log(userRole)


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
    res.download(doc.fileUrl, doc.name);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    await Document.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
