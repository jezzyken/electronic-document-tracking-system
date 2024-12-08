const professorService = require('../services/professorService');
const catchAsync = require('../utils/catchAsync');

exports.createProfessor = catchAsync(async (req, res) => {
  const professor = await professorService.createProfessor(req.body);
  res.status(201).json({
    status: 'success',
    data: { professor }
  });
});

exports.getAllProfessors = catchAsync(async (req, res) => {
  const professors = await professorService.getAllProfessors(req.query);
  res.status(200).json({
    status: 'success',
    results: professors.length,
    data: { professors }
  });
});

exports.getProfessor = catchAsync(async (req, res) => {
  const professor = await professorService.getProfessor(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { professor }
  });
});

exports.updateProfessor = catchAsync(async (req, res) => {
  const professor = await professorService.updateProfessor(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: { professor }
  });
});

exports.deleteProfessor = catchAsync(async (req, res) => {
  await professorService.deleteProfessor(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getProfessorTeachingLoad = catchAsync(async (req, res) => {
  const teachingLoad = await professorService.getProfessorTeachingLoad(
    req.params.id,
    req.query.academicYear,
    req.query.semester
  );
  res.status(200).json({
    status: 'success',
    data: { teachingLoad }
  });
});