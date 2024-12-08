const express = require("express");
const router = express.Router();
const Role = require("../../models/Roles");

router.post("/", async (req, res) => {
  try {
    const newRole = new Role({
      name: req.body.name,
      permissions: req.body.permissions,
      description: req.body.description,
      isActive: req.body.isActive,
    });

    const savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        permissions: req.body.permissions,
        description: req.body.description,
        isActive: req.body.isActive,
      },
      { new: true, runValidators: true }
    );

    if (updatedRole) {
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (deletedRole) {
      res.json({ message: "Role deleted successfully" });
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
