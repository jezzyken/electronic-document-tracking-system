const courseService = require("../services/courseService");
const catchAsync = require("../utils/catchAsync");

exports.createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  res.status(201).json({
    status: "success",
    data: { course },
  });
});

exports.getAllCourse = catchAsync(async (req, res) => {
  const courses = await courseService.getAllCourse(req.query);
  res.status(200).json({
    status: "success",
    results: courses.length,
    data: { courses },
  });
});

exports.getCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourse(req.params.id);
  res.status(200).json({
    status: "success",
    data: { course },
  });
});

exports.updateCourse = catchAsync(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: { course },
  });
});

exports.deleteCourse = catchAsync(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
