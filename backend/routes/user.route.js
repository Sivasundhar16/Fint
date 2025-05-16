import { Router } from "express";
import {
  allUsers,
  getsingleUser,
  userStatus,
} from "../controller/user.controller.js";

const router = Router();

router.get("/users", allUsers);
router.get("/users/:id", getsingleUser);
router.post("/user/status", userStatus);

export default router;
