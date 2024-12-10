const express = require("express");
const router = express.Router();
const { Status } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const statuses = await Status.find().sort("order");
    res.json(statuses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching statuses", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.json(status);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching status", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const status = new Status(req.body);
    const savedStatus = await status.save();
    res.status(201).json(savedStatus);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Status with this name or code already exists",
        error: error.message,
      });
    }
    res
      .status(400)
      .json({ message: "Error creating status", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const status = await Status.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.json(status);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Status with this name or code already exists",
        error: error.message,
      });
    }
    res
      .status(400)
      .json({ message: "Error updating status", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const status = await Status.findByIdAndDelete(req.params.id);
    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.json({ message: "Status deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting status", error: error.message });
  }
});

module.exports = router;
