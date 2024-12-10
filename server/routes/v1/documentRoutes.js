const express = require("express");
const router = express.Router();
const { Document } = require("../../models");
const { DocumentTracking } = require("../../models");
const upload = require("../../middleware/upload");
const { uploadToCloudinary } = require("../../utils/cloudinary");

router.get("/documents", async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("user")
      .populate("department")
      .lean();

    const documentsWithTracking = await Promise.all(
      documents.map(async (doc) => {
        const tracking = await DocumentTracking.find({ documentId: doc._id })
          .populate("fromDepartment")
          .populate("toDepartment")
          .populate("sentBy")
          .populate("receivedBy")
          .lean();
        return { ...doc, tracking };
      })
    );

    console.log(documentsWithTracking);

    res.json(documentsWithTracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/documents", upload.array("attachments"), async (req, res) => {
  const session = await Document.startSession();
  session.startTransaction();

  try {
    const documentData = JSON.parse(req.body.documents);
    const tracking = JSON.parse(req.body.tracking);

    const document = new Document({
      title: documentData.title,
      description: documentData.description,
      user: documentData.user,
      status: "Under Review",
      priority: documentData.priority,
      dueDate: documentData.dueDate,
      department: documentData.department,
      createdAt: new Date(),
    });
    await document.save({ session });

    if (req.files && req.files.length > 0) {
      const attachments = await Promise.all(
        req.files.map(async (file, index) => {
          const uploadResult = await uploadToCloudinary(
            file.path,
            file.originalname
          );
          return {
            title: file.originalname,
            fileUrl: uploadResult.url,
            fileType: file.mimetype,
            fileSize: file.size,
          };
        })
      );

      const trackingData = {
        documentId: document._id,
        fromDepartment: documentData.department,
        toDepartment: tracking.toDepartment,
        sentBy: documentData.user,
        sentAt: new Date(),
        receivedBy: null,
        receivedAt: null,
        status: "Under Review",
        comments: tracking.comments,
        documents: {
          attachments,
        },
      };

      const documentTracking = new DocumentTracking(trackingData);
      await documentTracking.save({ session });
    }

    await session.commitTransaction();

    const completeDocument = await Document.findById(document._id)
      .populate("user")
      .populate("department")
      .lean();

    const trackingResult = await DocumentTracking.find({
      documentId: document._id,
    })
      .populate("fromDepartment")
      .populate("toDepartment")
      .populate("sentBy")
      .populate("receivedBy")
      .lean();

    res.status(201).json({ ...completeDocument, tracking: trackingResult });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

router.post(
  "/documents/:id/tracking",
  upload.array("attachments"),
  async (req, res) => {
    const session = await Document.startSession();
    session.startTransaction();

    try {
      const documentId = req.params.id;
      const trackingData = req.body;

      let attachments = [];
      if (req.files && req.files.length > 0) {
        attachments = await Promise.all(
          req.files.map(async (file, index) => {
            const uploadResult = await uploadToCloudinary(
              file.path,
              file.originalname
            );
            return {
              title: file.originalname,
              fileUrl: uploadResult.url,
              fileType: file.mimetype,
              fileSize: file.size,
            };
          })
        );
      }

      const tracking = new DocumentTracking({
        documentId,
        fromDepartment: trackingData.fromDepartment,
        toDepartment: trackingData.toDepartment,
        sentBy: trackingData.sentBy,
        sentAt: new Date(),
        receivedBy: null,
        receivedAt: null,
        status: trackingData.status,
        comments: trackingData.comments,
        documents: {
          attachments,
        },
      });

      await tracking.save({ session });

      await Document.findByIdAndUpdate(
        documentId,
        { status: trackingData.status },
        { session }
      );

      await session.commitTransaction();

      const populatedTracking = await DocumentTracking.findById(tracking._id)
        .populate("fromDepartment")
        .populate("toDepartment")
        .populate("sentBy")
        .populate("receivedBy");

      res.status(201).json(populatedTracking);
    } catch (error) {
      await session.abortTransaction();
      res.status(400).json({ error: error.message });
    } finally {
      session.endSession();
    }
  }
);

router.get("/documents/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("user")
      .populate("department")
      .lean();

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const tracking = await DocumentTracking.find({ documentId: document._id })
      .populate("fromDepartment")
      .populate("toDepartment")
      .populate("sentBy")
      .populate("receivedBy")
      .lean();

    res.json({ ...document, tracking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch(
  "/documents/:documentId/tracking/:trackingId",
  async (req, res) => {
    const session = await Document.startSession();
    session.startTransaction();

    try {
      const { documentId, trackingId } = req.params;
      const { receivedBy, receivedAt } = req.body;

      const updatedTracking = await DocumentTracking.findByIdAndUpdate(
        trackingId,
        {
          receivedBy,
          receivedAt,
        },
        {
          new: true,
          session,
          runValidators: true,
        }
      )
        .populate("fromDepartment")
        .populate("toDepartment")
        .populate("sentBy")
        .populate("receivedBy");

      if (!updatedTracking) {
        throw new Error("Tracking record not found");
      }

      await session.commitTransaction();
      res.json(updatedTracking);
    } catch (error) {
      await session.abortTransaction();
      res.status(400).json({ error: error.message });
    } finally {
      session.endSession();
    }
  }
);

module.exports = router;
