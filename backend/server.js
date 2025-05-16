import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import dbConnect from "./database/db.js";
import adminAuthRoute from "./routes/auth.route.js";
import addsRoute from "./routes/adds.route.js";
import coupenRoute from "./routes/coupen.route.js";
import userRoute from "./routes/user.route.js";
import paymentRoute from "./routes/payment.route.js";
import bloodRequestroute from "./routes/blood.route.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use("/api", adminAuthRoute);
app.use("/api", addsRoute);
app.use("/api", userRoute);
app.use("/api", coupenRoute);
app.use("/api", paymentRoute);
app.use("/api", bloodRequestroute);

const serverRun = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error in the server", error.message);
    process.exit(1);
  }
};

serverRun();
