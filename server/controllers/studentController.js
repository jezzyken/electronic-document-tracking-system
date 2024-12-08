const studentService = require("../services/studentService");
const catchAsync = require("../utils/catchAsync");
const { parseStudentData } = require("../utils/parseFormData");

exports.createStudent = catchAsync(async (req, res, next) => {
  const studentData = parseStudentData(req.body, req.file);
  const student = await studentService.createStudent(studentData, req.file);
  res.status(201).json({
    status: "success",
    data: {
      student,
    },
  });
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
  const students = await studentService.getAllStudents(req.query);
  res.status(200).json({
    status: "success",
    results: students.length,
    data: {
      students,
    },
  });
});

exports.getStudent = catchAsync(async (req, res, next) => {
  const student = await studentService.getStudent(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

exports.updateStudent = catchAsync(async (req, res, next) => {
  const studentData = parseStudentData(req.body, req.file);
  const student = await studentService.updateStudent(
    req.params.id,
    studentData
  );

  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

exports.deleteStudent = catchAsync(async (req, res, next) => {
  await studentService.deleteStudent(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
