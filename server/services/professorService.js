const Professor = require("../models/Professor");
const TeacherLoad = require("../models/TeacherLoad");
const AppError = require("../utils/appError");

exports.createProfessor = async (data) => {
  return await Professor.create(data);
};

exports.getAllProfessors = async (query) => {
  return await Professor.find(query).populate({
    path: "academicInfo.department",
  });
};

exports.getProfessor = async (id) => {
  const professor = await Professor.findById(id);
  if (!professor) {
    throw new AppError("No professor found with that ID", 404);
  }
  return professor;
};

exports.updateProfessor = async (id, data) => {
  const professor = await Professor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!professor) {
    throw new AppError("No professor found with that ID", 404);
  }
  return professor;
};

exports.deleteProfessor = async (id) => {
  const professor = await Professor.findByIdAndDelete(id);
  if (!professor) {
    throw new AppError("No professor found with that ID", 404);
  }
  return professor;
};

exports.getProfessorTeachingLoad = async (
  professorId,
  academicYear,
  semester
) => {
  const teachingLoad = await TeacherLoad.findOne({
    professor: professorId,
    academicYear,
    semester,
    status: "active",
  }).populate("subjects.subject");

  if (!teachingLoad) {
    throw new AppError("No teaching load found for this professor", 404);
  }
  return teachingLoad;
};
