const express = require("express");
const professorController = require("../../controllers/professorController.js");
const router = express.Router();

router
  .route("/")
  .get(professorController.getAllProfessors)
  .post(professorController.createProfessor);

router
  .route("/:id")
  .get(professorController.getProfessor)
  .patch(professorController.updateProfessor)
  .delete(professorController.deleteProfessor);

router
  .route("/:id/teaching-load")
  .get(professorController.getProfessorTeachingLoad);

module.exports = router;
