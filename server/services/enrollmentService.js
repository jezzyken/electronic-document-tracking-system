const Enrollment = require("../models/Enrollment");
const EvaluatedSubject = require("../models/EvaluatedSubject");
const StudentProfile = require("../models/StudentProfile");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

exports.enrollNewStudent = async (studentData, enrollmentData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await StudentProfile.create([studentData], { session });

    const enrollment = await Enrollment.create(
      [
        {
          ...enrollmentData,
          student: student[0]._id,
          enrollmentType: "new",
          enrollmentStatus: "evaluated",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { student: student[0], enrollment: enrollment[0] };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.enrollContinuingStudent = async (studentId, enrollmentData) => {
  const student = await StudentProfile.findById(studentId);
  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    academicYear: enrollmentData.academicYear,
    semester: enrollmentData.semester,
  });

  if (existingEnrollment) {
    throw new AppError("Student already enrolled for this semester", 400);
  }

  const previousEvaluations = await EvaluatedSubject.find()
    .populate({
      path: "enrollment",
      match: { student: studentId },
    })
    .sort({ "enrollment.academicYear": -1, "enrollment.semester": -1 });

  const enrollment = await Enrollment.create({
    ...enrollmentData,
    student: studentId,
    enrollmentType: "old",
    enrollmentStatus: "evaluated",
  });

  return { student, enrollment, previousEvaluations };
};

exports.submitGrades = async (enrollmentId, gradesData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    const evaluatedSubjects = await EvaluatedSubject.create(
      gradesData.map((grade) => ({
        enrollment: enrollmentId,
        subject: grade.subject,
        grade: grade.grade,
        remarks: grade.remarks,
        evaluatedBy: grade.evaluatedBy,
      })),
      { session }
    );

    enrollment.enrollmentStatus = "evaluated";
    await enrollment.save({ session });

    await session.commitTransaction();
    return { enrollment, evaluatedSubjects };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.getStudentAcademicHistory = async (studentId) => {
  const enrollments = await Enrollment.find({ student: studentId }).sort({
    academicYear: -1,
    semester: -1,
  });

  const evaluatedSubjects = await EvaluatedSubject.find()
    .populate("subject")
    .populate({
      path: "enrollment",
      match: { student: studentId },
    })
    .sort({ "enrollment.academicYear": -1, "enrollment.semester": -1 });

  return { enrollments, evaluatedSubjects };
};

exports.getEnrollmentDetails = async (enrollmentId) => {
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate("student")
    .populate("course")
    .populate("subjects");

  const evaluatedSubjects = await EvaluatedSubject.find({
    enrollment: enrollmentId,
  })
    .populate("subject")
    .populate("evaluatedBy");

  return { enrollment, evaluatedSubjects };
};

exports.validatePrerequisites = async (studentId, subjects) => {
  const student = await StudentProfile.findById(studentId);
  const previousEnrollments = await Enrollment.find({
    student: studentId,
    enrollmentStatus: "completed",
  });

  const passedSubjects = new Set(
    previousEnrollments.flatMap((enrollment) =>
      enrollment.subjects
        .filter((subject) => subject.grade.finalGrade >= 75)
        .map((subject) => subject.subject.toString())
    )
  );

  const subjectsToTake = await Subject.find({
    _id: { $in: subjects },
  }).populate("prerequisites");

  const missingPrerequisites = subjectsToTake
    .filter((subject) =>
      subject.prerequisites.some(
        (prereq) => !passedSubjects.has(prereq._id.toString())
      )
    )
    .map((subject) => ({
      subject: subject.catNo,
      missingPrerequisites: subject.prerequisites
        .filter((prereq) => !passedSubjects.has(prereq._id.toString()))
        .map((prereq) => prereq.catNo),
    }));

  return missingPrerequisites;
};

exports.addSubjectsToEnrollment = async (enrollmentId, subjects) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new AppError("Enrollment not found", 404);
  }

  const missingPrerequisites = await this.validatePrerequisites(
    enrollment.student,
    subjects.map((s) => s.subject)
  );

  if (missingPrerequisites.length > 0) {
    throw new AppError(
      "Missing prerequisites: " + JSON.stringify(missingPrerequisites),
      400
    );
  }

  for (const subject of subjects) {
    const teacherLoad = await TeacherLoad.findById(subject.teacherLoad);
    if (teacherLoad.isSectionFull(subject.section)) {
      throw new AppError(
        `Section ${subject.section} is full for subject ${subject.subject}`,
        400
      );
    }
  }

  enrollment.subjects.push(...subjects);
  await enrollment.save();

  return enrollment;
};

exports.dropSubject = async (enrollmentId, subjectId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new AppError("Enrollment not found", 404);
  }

  const subjectIndex = enrollment.subjects.findIndex(
    (s) => s._id.toString() === subjectId
  );

  if (subjectIndex === -1) {
    throw new AppError("Subject not found in enrollment", 404);
  }

  enrollment.subjects[subjectIndex].status = "dropped";
  await enrollment.save();

  return enrollment;
};

exports.getEnrollmentsByStudent = async (req, next) => {
  const { studentId } = req.params;
  const { academicYear, semester } = req.query;

  if (!studentId) {
    return next(new AppError("Student ID is required", 400));
  }

  if (!academicYear || !semester) {
    return next(new AppError("Academic year and semester are required", 400));
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    academicYear,
    semester,
  })
    .populate("subjects")
    .populate({
      path: "subjects",
    });

  if (!enrollment) {
    return [];
  }

  return enrollment;
};

exports.getEnrollmentDetails = async (enrollmentId) => {
  return await Enrollment.findById(enrollmentId)
    .populate("student")
    .populate("curriculum")
    .populate("subjects.subject")
    .populate("subjects.teacherLoad");
};

exports.updateEnrollmentStatus = async (req) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.enrollmentId,
    { $set: { enrollmentStatus: "enrolled" } },
    { new: true }
  );

  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }
  return enrollment;
};
