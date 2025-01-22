const express = require("express");
const router = express.Router();
const { Document, DocumentTracking, DocumentRequest } = require("../../models");
const { auth } = require("../../middleware/authMiddleware");
const moment = require("moment");

router.get("/stats", auth, async (req, res) => {
  try {
    const isAdmin = req.user.role.name === "Admin";
    const userDepartment = req.user.department;

    let documentsQuery = {};
    if (!isAdmin) {
      const documentsInvolvedInTracking = await DocumentTracking.distinct("documentId", {
        $or: [
          { fromDepartment: userDepartment },
          { toDepartment: userDepartment }
        ]
      });

      documentsQuery = {
        $or: [
          { department: userDepartment },
          { _id: { $in: documentsInvolvedInTracking } }
        ]
      };
    }

    const totalDocuments = await Document.countDocuments(documentsQuery);
    const documentsUnderReview = await Document.countDocuments({
      ...documentsQuery,
      status: "Under Review"
    });
    const documentsCompleted = await Document.countDocuments({
      ...documentsQuery,
      status: "Completed"
    });

    const highPriorityDocs = await Document.countDocuments({
      ...documentsQuery,
      priority: "High"
    });
    const mediumPriorityDocs = await Document.countDocuments({
      ...documentsQuery,
      priority: "Medium"
    });
    const lowPriorityDocs = await Document.countDocuments({
      ...documentsQuery,
      priority: "Low"
    });

    const totalRequests = await DocumentRequest.countDocuments();
    const pendingRequests = await DocumentRequest.countDocuments({ status: "pending" });
    const processingRequests = await DocumentRequest.countDocuments({ status: "processing" });
    const completedRequests = await DocumentRequest.countDocuments({ status: "completed" });

    const recentActivities = await DocumentTracking.find(
      !isAdmin ? {
        $or: [
          { fromDepartment: userDepartment },
          { toDepartment: userDepartment }
        ]
      } : {}
    )
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('documentId')
      .populate('fromDepartment')
      .populate('toDepartment')
      .populate('sentBy')
      .lean();

    res.json({
      documentStats: {
        total: totalDocuments,
        underReview: documentsUnderReview,
        completed: documentsCompleted
      },
      priorityStats: {
        high: highPriorityDocs,
        medium: mediumPriorityDocs,
        low: lowPriorityDocs
      },
      requestStats: {
        total: totalRequests,
        pending: pendingRequests,
        processing: processingRequests,
        completed: completedRequests
      },
      recentActivities
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

router.get("/timeline/:documentId", auth, async (req, res) => {

  console.log("test")
  try {
    const { documentId } = req.params;
    const isAdmin = req.user.role.name === "Admin";
    const userDepartment = req.user.department;

    const document = await Document.findById(documentId)
      .populate('department')
      .populate('user');

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (!isAdmin && document.department.toString() !== userDepartment.toString()) {
      const hasAccess = await DocumentTracking.exists({
        documentId,
        $or: [
          { fromDepartment: userDepartment },
          { toDepartment: userDepartment }
        ]
      });

      if (!hasAccess) {
        return res.status(403).json({ error: "Not authorized to view this document" });
      }
    }

    const timeline = await DocumentTracking.find({ documentId })
      .sort({ createdAt: 1 })
      .populate('fromDepartment')
      .populate('toDepartment')
      .populate('sentBy')
      .populate('receivedBy')
      .lean();

    res.json({
      document,
      timeline
    });
  } catch (error) {
    console.error("Error fetching document timeline:", error);
    res.status(500).json({ error: "Failed to fetch document timeline" });
  }
});

router.get("/requests", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const query = {};
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const total = await DocumentRequest.countDocuments(query);
    const requests = await DocumentRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const statusCounts = await DocumentRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      requests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      },
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error("Error fetching document requests:", error);
    res.status(500).json({ error: "Failed to fetch document requests" });
  }
});

module.exports = router;