const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.fullName,
      isActive: user.isActive,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const login = async (email, password) => {
  console.log(email, password);
  const userData = await User.findOne({ email })
    .select("+password")
    .populate("department", "name")
    .populate("role");

  if (!userData || !(await userData.comparePassword(password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  userData.password = undefined;

  // let teacher = null;

  // if (user.roles === "teacher") {
  //   teacher = await Teacher.findOne({ user: user._id });
  // }

  const user = {
    _id: userData._id,
    email: userData.email,
    role: userData.role,
    name: userData.fullName,
    department: userData.department,
    fullName: userData?.fullName || "Admin",
    isActive: userData.isActive,
  };

  const token = generateToken(userData);

  return {
    user,
    token,
  };
};

module.exports = {
  login,
  generateToken,
};
