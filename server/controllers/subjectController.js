const subjectService = require('../services/subjectService');
const catchAsync = require('../utils/catchAsync');

exports.createSubject = catchAsync(async (req, res) => {
  const subject = await subjectService.createSubject(req.body);
  res.status(201).json({
    status: 'success',
    data: { subject }
  });
});

exports.getAllSubjects = catchAsync(async (req, res) => {
  const subjects = await subjectService.getAllSubjects(req);
  res.status(200).json({
    status: 'success',
    results: subjects.length,
    data: { subjects }
  });
});

exports.getSubject = catchAsync(async (req, res) => {
  const subject = await subjectService.getSubject(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { subject }
  });
});

exports.updateSubject = catchAsync(async (req, res) => {
  const subject = await subjectService.updateSubject(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: { subject }
  });
});

exports.deleteSubject = catchAsync(async (req, res) => {
  await subjectService.deleteSubject(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getSubjectsByYearAndSemester = catchAsync(async (req, res) => {
  const subjects = await subjectService.getSubjectsByYearAndSemester(
    req.params.yearLevel,
    req.params.semester
  );
  res.status(200).json({
    status: 'success',
    results: subjects.length,
    data: { subjects }
  });
});