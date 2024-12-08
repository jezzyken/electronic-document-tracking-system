const departmentService = require("../services/departmentService");
const catchAsync = require("../utils/catchAsync");

const createDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.createDepartment(req.body);

  res.status(201).json({
    status: "success",
    data: { department },
  });
});

const getAllDepartments = catchAsync(async (req, res) => {
  const departments = await departmentService.getAllDepartments();

  res.status(200).json({
    status: "success",
    results: departments.length,
    data: { departments },
  });
});

const getDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { department },
  });
});

const updateDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.updateDepartment(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: { department },
  });
});

const deleteDepartment = catchAsync(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
