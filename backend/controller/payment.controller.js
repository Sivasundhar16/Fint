import Payment from "../models/payment.model.js";
import ApiRes from "../service/apires.js";

export const getAllpayment = async (req, res) => {
  try {
    const payment = await Payment.find();

    if (!payment) {
      return ApiRes(req, 404, "Payment Details not found");
    }
  } catch (error) {
    console.log(error);
    return ApiRes(res, 500, "Internal Server Error");
  }
};
export const getsinglePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);

    if (!payment) {
      return ApiRes(res, 404, "Payment Details Not found");
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.log(error);
  }
};
