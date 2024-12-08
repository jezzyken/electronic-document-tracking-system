const Subject = require("../models/Subject");
const AppError = require("../utils/appError");

exports.createSubject = async (data) => {
  return await Subject.create(data);
};

exports.getAllSubjects = async (req) => {
  const { semester, yearLevel, course } = req.query;

  const query = {};

  if (semester) query.semester = semester;
  if (yearLevel) query.yearLevel = Number(yearLevel);
  if (course) query.course = { $in: [course] };

  return await Subject.find(query).populate("course");
};

exports.getSubject = async (id) => {
  const subject = await Subject.findById(id);
  if (!subject) {
    throw new AppError("No subject found with that ID", 404);
  }
  return subject;
};

exports.updateSubject = async (id, data) => {
  const subject = await Subject.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!subject) {
    throw new AppError("No subject found with that ID", 404);
  }
  return subject;
};

exports.deleteSubject = async (id) => {
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) {
    throw new AppError("No subject found with that ID", 404);
  }
  return subject;
};

exports.getSubjectsByYearAndSemester = async (yearLevel, semester) => {
  return await Subject.find({
    yearLevel: parseInt(yearLevel),
    semester,
  });
};
