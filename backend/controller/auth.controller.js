import * as yup from "yup";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiRes from "../service/apires.js";

export const signUp = async (req, res) => {
  console.log("Signup request body:", req.body);

  const signUpSchema = yup.object({
    username: yup.string(),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  try {
    await signUpSchema.validate(req.body, { abortEarly: false });
  } catch (validationError) {
    const errors = validationError.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "User already Exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newAdmin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const adminData = newAdmin.toObject();
    delete adminData.password;

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: adminData,
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const logIn = async (req, res) => {
  console.log("Login request body:", req.body);

  const logInYupSchema = yup.object({
    email: yup.string().required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  try {
    await logInYupSchema.validate(req.body, { abortEarly: false });
  } catch (validationError) {
    const errors = validationError.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return ApiRes(res, 400, "Validation failed", { errors });
  }

  const { email, password } = req.body;

  try {
    // Find admin by either username or email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return ApiRes(res, 404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return ApiRes(res, 401, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return ApiRes(res, 200, "Login successful", {
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (err) {
    return ApiRes(res, 500, "Server error", { error: err.message });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return ApiRes(res, 200, "Logged out successfully");
  } catch (error) {
    return ApiRes(res, 500, "Logout failed", { error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (validationError) {
    const errors = validationError.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return ApiRes(res, 400, "Validation failed", { errors });
  }

  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return ApiRes(res, 404, "User not found");
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: admin._id, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // In a real application, you would send this token via email
    // For now, just return it in the response
    return ApiRes(res, 200, "Password reset token generated", { resetToken });
  } catch (err) {
    return ApiRes(res, 500, "Server error", { error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const schema = yup.object({
    token: yup.string().required("Reset token is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (validationError) {
    const errors = validationError.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return ApiRes(res, 400, "Validation failed", { errors });
  }

  const { token, password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "password-reset") {
      return ApiRes(res, 400, "Invalid token purpose");
    }

    // Find admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return ApiRes(res, 404, "User not found");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    return ApiRes(res, 200, "Password reset successful");
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return ApiRes(res, 400, "Invalid or expired token");
    }
    return ApiRes(res, 500, "Server error", { error: err.message });
  }
};
