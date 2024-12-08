const express = require('express');
const subjectController = require('../../controllers/subjectController');
const router = express.Router();

router
  .route('/')
  .get(subjectController.getAllSubjects)
  .post(subjectController.createSubject);

router
  .route('/:id')
  .get(subjectController.getSubject)
  .patch(subjectController.updateSubject)
  .delete(subjectController.deleteSubject);

router
  .route('/year/:yearLevel/semester/:semester')
  .get(subjectController.getSubjectsByYearAndSemester);

module.exports = router;