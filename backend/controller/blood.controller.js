import BloodRequest from "../models/bloodgroup.model.js";
import ApiRes from "../service/apires.js";

export const viewallBloodrequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.find();

    if (!bloodRequest) {
      return ApiRes(res, 404, "Empty Request");
    }

    res.status(201).json({
      message: "Success",
      data: bloodRequest,
    });
  } catch (error) {
    console.log(error);

    return ApiRes(res, 500, "Server Error");
  }
};

export const viewBloodRequest = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return ApiRes(res, 400, "Id not found");
    }

    const bloodRequest = await BloodRequest.findById(id);

    if (!bloodRequest) {
      return ApiRes(res, 400, "Blood Request Not Found");
    }

    res.status(201).json({
      message: "Success",
      data: bloodRequest,
    });
  } catch (error) {
    console.log(error);
    return ApiRes(res, 500, "Server Error");
  }
};

export const addBloodRequest = async (req, res) => {};

export const editBloodRequest = async (req, res) => {};

export const deleteBloodRequest = async () => {};
