const enrollmentService = require("../services/enrollmentService");
const catchAsync = require("../utils/catchAsync");

exports.enrollNewStudent = catchAsync(async (req, res) => {
  const { studentData, enrollmentData } = req.body;
  const result = await enrollmentService.enrollNewStudent(
    studentData,
    enrollmentData
  );

  res.status(201).json({
    status: "success",
    data: result,
  });
});

exports.enrollContinuingStudent = catchAsync(async (req, res) => {
  console.log("studentId:", req.params.studentId, typeof req.params.studentId);
  const result = await enrollmentService.enrollContinuingStudent(
    req.params.studentId,
    req.body
  );

  res.status(201).json({
    status: "success",
    data: result,
  });
});

exports.addSubjects = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.addSubjectsToEnrollment(
    req.params.enrollmentId,
    req.body.subjects
  );

  res.status(200).json({
    status: "success",
    data: { enrollment },
  });
});

exports.dropSubject = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.dropSubject(
    req.params.enrollmentId,
    req.params.subjectId
  );

  res.status(200).json({
    status: "success",
    data: { enrollment },
  });
});

exports.getStudentEnrollments = catchAsync(async (req, res, next) => {
  const enrollments = await enrollmentService.getEnrollmentsByStudent(
    req,
    next
  );
  res.status(200).json({
    status: "success",
    results: enrollments.length,
    data: { enrollments },
  });
});

exports.getEnrollmentDetails = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentDetails(
    req.params.enrollmentId
  );

  res.status(200).json({
    status: "success",
    data: { enrollment },
  });
});

exports.updateEnrollmentStatus = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollmentStatus(req);
  res.status(200).json({
    status: "success",
    data: { enrollment },
  });
});
