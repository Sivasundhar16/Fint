import { Router } from "express";
import {
  getAllpayment,
  getsinglePayment,
} from "../controller/payment.controller.js";

const router = Router();

router.get("/payment", getAllpayment);
router.get("/payment/:id", getsinglePayment);

export default router;

// Payment Listing API: View all payment transactions
// Payment Detail API: Get detailed information about specific payments
// Payment Filter API: Filter payments by date, status, etc.
