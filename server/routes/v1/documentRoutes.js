const express = require("express");
const router = express.Router();
const { Document, DocumentTracking } = require("../../models");
const upload = require("../../middleware/upload");
const { uploadToCloudinary } = require("../../utils/cloudinary");
const { auth, authorize } = require("../../middleware/authMiddleware");
const moment = require("moment");

async function handleAttachmentUploads(files) {
  if (!files || files.length === 0) return [];

  return Promise.all(
    files.map(async (file) => {
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

function formatDate(date) {
  if (!date) return null;
  return moment(date).format("YYYY-MM-DD");
}

router.get("/documents", auth, async (req, res) => {
  try {
    const isAdmin = req.user.role.name === "Admin";
    const userDepartment = req.user.department;

    let documents;

    if (isAdmin) {
      documents = await Document.find()
        .sort({ _id: -1 })
        .populate("user")
        .populate("department")
        .lean();
    } else {
      const documentsInvolvedInTracking = await DocumentTracking.distinct(
        "documentId",
        {
          $or: [
            { fromDepartment: userDepartment },
            { toDepartment: userDepartment },
          ],
        }
      );

      documents = await Document.find({
        $or: [
          { department: userDepartment },
          { _id: { $in: documentsInvolvedInTracking } },
        ],
      })
        .sort({ _id: -1 })
        .populate("user")
        .populate("department")
        .lean();
    }

    documents = documents.map((doc) => ({
      ...doc,
      dueDate: formatDate(doc.dueDate),
    }));

    const documentsWithTracking = await Promise.all(
      documents.map(async (doc) => {
        let tracking;

        if (isAdmin) {
          tracking = await DocumentTracking.find({ documentId: doc._id })
            .populate("fromDepartment")
            .populate("toDepartment")
            .populate("sentBy")
            .populate("receivedBy")
            .lean();
        } else {
          const isInvolvedInTracking = doc.tracking?.some(
            (track) =>
              track.fromDepartment._id.toString() ===
                userDepartment.toString() ||
              track.toDepartment._id.toString() === userDepartment.toString()
          );

          const trackingQuery = isInvolvedInTracking
            ? { documentId: doc._id }
            : {
                documentId: doc._id,
                $or: [
                  { fromDepartment: userDepartment },
                  { toDepartment: userDepartment },
                ],
              };

          tracking = await DocumentTracking.find(trackingQuery)
            .populate("fromDepartment")
            .populate("toDepartment")
            .populate("sentBy")
            .populate("receivedBy")
            .lean();
        }

        return { ...doc, tracking };
      })
    );

    res.json(documentsWithTracking);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

router.post(
  "/documents",
  auth,
  upload.array("attachments"),
  async (req, res) => {
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
      });
      await document.save({ session });

      const attachments = await handleAttachmentUploads(req.files);

      const trackingData = new DocumentTracking({
        documentId: document._id,
        fromDepartment: documentData.department,
        toDepartment: tracking.toDepartment,
        sentBy: documentData.user,
        sentAt: new Date(),
        status: "Under Review",
        comments: tracking.comments,
        documents: { attachments },
      });
      await trackingData.save({ session });

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
      console.error("Error creating document:", error);
      res.status(400).json({ error: "Failed to create document" });
    } finally {
      session.endSession();
    }
  }
);

router.post(
  "/documents/:id/tracking",
  auth,
  upload.array("attachments"),
  async (req, res) => {
    const session = await Document.startSession();
    session.startTransaction();

    try {
      const { id: documentId } = req.params;
      const trackingData = req.body;

      const attachments = await handleAttachmentUploads(req.files);

      const tracking = new DocumentTracking({
        documentId,
        fromDepartment: trackingData.fromDepartment,
        toDepartment: trackingData.toDepartment,
        sentBy: trackingData.sentBy,
        sentAt: new Date(),
        status: trackingData.status,
        comments: trackingData.comments,
        documents: { attachments },
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
      console.error("Error adding tracking:", error);
      res.status(400).json({ error: "Failed to add tracking" });
    } finally {
      session.endSession();
    }
  }
);

router.get("/documents/:id", auth, async (req, res) => {
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
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

router.patch(
  "/documents/:documentId/tracking/:trackingId",
  auth,
  async (req, res) => {
    const session = await Document.startSession();
    session.startTransaction();

    try {
      const { documentId, trackingId } = req.params;
      const { receivedBy, receivedAt } = req.body;

      if (req.user.role.name !== "Admin") {
        const tracking = await DocumentTracking.findById(trackingId);
        if (
          tracking.toDepartment.toString() !== req.user.department.toString()
        ) {
          throw new Error("User not authorized to receive this document");
        }
      }

      const updatedTracking = await DocumentTracking.findByIdAndUpdate(
        trackingId,
        { receivedBy, receivedAt },
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
      console.error("Error updating tracking:", error);
      res.status(400).json({ error: "Failed to update tracking" });
    } finally {
      session.endSession();
    }
  }
);

module.exports = router;
