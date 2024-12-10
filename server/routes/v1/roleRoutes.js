const express = require("express");
const router = express.Router();
const { Role } = require("../../models");

router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const role = new Role(req.body);
    const savedRole = await role.save();
    res.status(201).json(savedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json({ message: "Role deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/permissions", async (req, res) => {
  try {
    const { permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    role.permissions = [...new Set([...role.permissions, ...permissions])];
    const updatedRole = await role.save();
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id/permissions", async (req, res) => {
  try {
    const { permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    role.permissions = role.permissions.filter(
      (permission) => !permissions.includes(permission)
    );
    const updatedRole = await role.save();
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
