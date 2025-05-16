import { Router } from "express";
import {
  addBloodRequest,
  deleteBloodRequest,
  editBloodRequest,
  viewBloodRequest,
  viewallBloodrequest,
} from "../controller/blood.controller.js";

const router = Router();

router.get("/bloodrequest", viewallBloodrequest);
router.get("/bloodrequest/id", viewBloodRequest);
router.post("/bloodrequest", addBloodRequest);
router.put("/bloodrequest/:id", editBloodRequest);
router.delete("/bloodrequest/:id", deleteBloodRequest);

export default router;
