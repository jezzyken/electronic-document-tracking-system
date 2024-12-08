const express = require("express");
const departmentController = require("../../controllers/departmentController");
const { auth, authorize } = require("../../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(departmentController.getAllDepartments)
  .post(auth, authorize("admin"), departmentController.createDepartment);

router
  .route("/:id")
  .get(departmentController.getDepartment)
  .patch(auth, authorize("admin"), departmentController.updateDepartment)
  .delete(auth, authorize("admin"), departmentController.deleteDepartment);

module.exports = router;
