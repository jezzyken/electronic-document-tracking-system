const User = require("../models/User");
const AppError = require("../utils/appError");

const createUser = async (userData) => {
  if (!userData.email || !userData.password) {
    throw new AppError("Email and password are required", 400);
  }

  const existingUser = await User.findOne({
    email: userData.email.toLowerCase(),
  });
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const user = await User.create(userData);
  return user;
};

const getAllUsers = async (query = {}) => {
  const users = await User.find(query);
  if (!users.length) {
    throw new AppError("No users found", 404);
  }
  return users;
};

const getUserById = async (userId) => {
  console.log(userId);
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, currentPassword, newPassword } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        status: "error",
        message: "Email and username are required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          status: "error",
          message:
            "Both current password and new password are required for password update",
        });
      }

      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "error",
          message: "Current password is incorrect",
        });
      }
      user.password = newPassword;
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res.status(400).json({
          status: "error",
          message: "Email already in use",
        });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: id } });
      if (usernameExists) {
        return res.status(400).json({
          status: "error",
          message: "Username already in use",
        });
      }
      user.username = username;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

const deleteUser = async (userId) => {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid user ID format", 400);
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

const getUserByEmail = async (email) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

const getUsersByRole = async (role) => {
  if (!role) {
    throw new AppError("Role is required", 400);
  }

  const validRoles = ["user", "admin", "moderator"];
  if (!validRoles.includes(role)) {
    throw new AppError("Invalid role specified", 400);
  }

  const users = await User.find({ roles: role });
  if (!users.length) {
    throw new AppError(`No users found with role: ${role}`, 404);
  }
  return users;
};

const toggleUserStatus = async (userId) => {
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid user ID format", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isActive = !user.isActive;
  await user.save();
  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUsersByRole,
  toggleUserStatus,
};
