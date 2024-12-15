const express = require("express");
const router = express.Router();
const { DocumentRequest } = require("../../models");

router.post("/", async (req, res) => {
  try {
    const documentRequest = new DocumentRequest({
      fullName: req.body.fullName,
      studentId: req.body.studentId,
      email: req.body.email,
      phone: req.body.phone,
      requestedDocuments: req.body.requestedDocuments,
      purpose: req.body.purpose,
      notes: req.body.notes,
    });

    const savedRequest = await documentRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const studentId = req.query.studentId;
    const email = req.query.email;

    const query = {};
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;
    if (email) query.email = email;

    const totalRequests = await DocumentRequest.countDocuments(query);
    const requests = await DocumentRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      requests,
      currentPage: page,
      totalPages: Math.ceil(totalRequests / limit),
      totalRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:trackingNumber", async (req, res) => {
  try {
    const request = await DocumentRequest.findOne({
      trackingNumber: req.params.trackingNumber,
    });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:trackingNumber/status", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const request = await DocumentRequest.findOne({
      trackingNumber: req.params.trackingNumber,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    request.statusHistory.push({
      status,
      notes,
      timestamp: new Date(),
    });

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:trackingNumber", async (req, res) => {
  try {
    const allowedUpdates = [
      "fullName",
      "email",
      "phone",
      "requestedDocuments",
      "purpose",
      "notes",
    ];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const request = await DocumentRequest.findOneAndUpdate(
      { trackingNumber: req.params.trackingNumber },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:trackingNumber", async (req, res) => {
  try {
    const request = await DocumentRequest.findOneAndDelete({
      trackingNumber: req.params.trackingNumber,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
