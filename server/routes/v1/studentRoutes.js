const express = require("express");
const studentController = require("../../controllers/studentController");
const router = express.Router();
const upload = require("../../middleware/upload");

router.route("/").get(studentController.getAllStudents);

router.post("/", upload.single("image"), studentController.createStudent);

router
  .route("/:id")
  .get(studentController.getStudent)
  .delete(studentController.deleteStudent);

router.patch("/:id", upload.single("image"), studentController.updateStudent);

module.exports = router;
