const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("Please authenticate", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).populate("role");

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.some((role) => req.user.roles.includes(role))) {
      return next(new AppError("Not authorized", 403));
    }
    next();
  };
};

module.exports = {
  auth,
  authorize,
};
