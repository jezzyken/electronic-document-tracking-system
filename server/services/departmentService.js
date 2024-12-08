const Department = require('../models/Department');
const AppError = require('../utils/appError');

const createDepartment = async (data) => {
  try {
    const department = await Department.create(data);
    return department;
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      throw new AppError('Department name already exists', 400);
    }
    throw error;
  }
};

const getAllDepartments = async () => {
  const departments = await Department.find();
  return departments;
};

const getDepartmentById = async (id) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new AppError('Department not found', 404);
  }
  return department;
};

const updateDepartment = async (id, data) => {
  try {
    const department = await Department.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    
    return department;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Department name already exists', 400);
    }
    throw error;
  }
};

const deleteDepartment = async (id) => {
  const department = await Department.findByIdAndDelete(id);
  
  if (!department) {
    throw new AppError('Department not found', 404);
  }
  
  return department;
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};