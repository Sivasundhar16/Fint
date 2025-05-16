import express from "express";
import {
  forgotPassword,
  logIn,
  logOut,
  resetPassword,
  signUp,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/admin/signup", signUp);
router.post("/admin/login", logIn);
router.post("/admin/forgotpassword", forgotPassword);
router.post("/admin/resetpassword", resetPassword);
router.post("/admin/logout", logOut);

export default router;
