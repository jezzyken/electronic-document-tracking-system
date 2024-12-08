const userService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createUser = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);
  user.password = undefined;
  res.status(201).json({
    status: "success",
    data: { user },
  });
});

const getUsers = catchAsync(async (req, res, next) => {
  const query = { ...req.query, roles: { $ne: "student" } };
  const users = await userService.getAllUsers(query);
  console.log(users);
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  return await userService.updateUser(req, res);
});

const deleteUser = catchAsync(async (req, res, next) => {
  if (req.user && req.user.roles !== "admin" && req.params.id !== req.user.id) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  await userService.deleteUser(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getUserByEmail = catchAsync(async (req, res, next) => {
  if (!req.params.email) {
    return next(new AppError("Please provide an email", 400));
  }

  const user = await userService.getUserByEmail(req.params.email);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const getUsersByRole = catchAsync(async (req, res, next) => {
  if (req.user && req.user.roles !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  const users = await userService.getUsersByRole(req.params.role);

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

const toggleUserStatus = catchAsync(async (req, res, next) => {
  if (req.user && req.user.roles !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  const user = await userService.toggleUserStatus(req.params.id);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUsersByRole,
  toggleUserStatus,
};
