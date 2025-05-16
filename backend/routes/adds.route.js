import express from "express";
import {
  deleteAdd,
  getAllAdds,
  getSingleAdd,
  postAdds,
  updateAdd,
} from "../controller/adds.controller.js";

const router = express.Router();

router.get("/adds", getAllAdds);
router.post("/adds", postAdds);
router.get("/adds/:id", getSingleAdd);
router.put("/adds/:id", updateAdd);
router.delete("/adds/:id", deleteAdd);

export default router;
