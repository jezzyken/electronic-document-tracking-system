const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authService");

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
});

const verifyUser = catchAsync(async (req, res) => {
  const user = {
    _id: req.user._id,
    email: req.user.email,
    roles: req.user.roles,
  };

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

module.exports = {
  login,
  verifyUser,
};
