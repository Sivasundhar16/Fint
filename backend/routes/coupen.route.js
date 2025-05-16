import { Router } from "express";
import {
  addCoupen,
  deleteCoupen,
  getCoupen,
  updateCoupen,
} from "../controller/coupen.controller.js";

const route = Router();

route.get("/coupen", getCoupen);
route.post("/coupen", addCoupen);
route.put("/coupen/:id", updateCoupen);
route.delete("/coupen/:id", deleteCoupen);

export default route;
