const Curriculum = require('../models/Curriculum');
const AppError = require('../utils/appError');

exports.createCurriculum = async (data) => {
  return await Curriculum.create(data);
};

exports.getAllCurriculum = async (query) => {
  return await Curriculum.find(query);
};

exports.getCurriculum = async (id) => {
  const curriculum = await Curriculum.findById(id);
  if (!curriculum) {
    throw new AppError('No curriculum found with that ID', 404);
  }
  return curriculum;
};

exports.updateCurriculum = async (id, data) => {
  const curriculum = await Curriculum.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!curriculum) {
    throw new AppError('No curriculum found with that ID', 404);
  }
  return curriculum;
};

exports.deleteCurriculum = async (id) => {
  const curriculum = await Curriculum.findByIdAndDelete(id);
  if (!curriculum) {
    throw new AppError('No curriculum found with that ID', 404);
  }
  return curriculum;
};