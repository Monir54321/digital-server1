const {
  loginUserService,
  verifyTokenService,
  checkUserExistService,
  signupUserService,
} = require("../services/auth.services");

exports.signupController = async (req, res) => {
  try {
    const result = await signupUserService(req.body);
    res
      .status(201)
      .json({ status: "Success", message: "Signup successful", data: result });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: error.message });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Email and password are required" });
    }
    const result = await loginUserService(email, password);
    if (!result) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid credentials" });
    }
    res
      .status(200)
      .json({ status: "Success", message: "Login successful", data: result });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

exports.verifyTokenController = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ status: "Failed", message: "Token is required" });
    }
    const decoded = verifyTokenService(token);
    if (!decoded) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid or expired token" });
    }
    // Check if user exists in DB
    const exists = await checkUserExistService(decoded.email);
    if (!exists) {
      return res
        .status(404)
        .json({ status: "Failed", message: "User does not exist" });
    }
    res.status(200).json({
      status: "Success",
      message: "Token is valid and user exists",
      data: decoded,
    });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};
