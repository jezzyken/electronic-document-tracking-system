const teacherService = require("../services/teacherService");
const catchAsync = require("../utils/catchAsync");

const createTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body);

  res.status(201).json({
    status: "success",
    data: { teacher },
  });
});

const getAllTeachers = catchAsync(async (req, res) => {
  const teachers = await teacherService.getAllTeachers();

  res.status(200).json({
    status: "success",
    results: teachers.length,
    data: { teachers },
  });
});

const getTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { teacher },
  });
});

const updateTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.updateTeacher(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: { teacher },
  });
});

const deleteTeacher = catchAsync(async (req, res) => {
  await teacherService.deleteTeacher(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
};