const express = require("express");
const router = express.Router();
const { Department } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching departments", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching department", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const department = new Department({
      name: req.body.name,
      isActive: req.body.isActive,
    });
    const savedDepartment = await department.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Department with this name already exists",
        error: error.message,
      });
    }
    res
      .status(400)
      .json({ message: "Error creating department", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isActive: req.body.isActive,
      },
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Department with this name already exists",
        error: error.message,
      });
    }
    res
      .status(400)
      .json({ message: "Error updating department", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting department", error: error.message });
  }
});

module.exports = router;
