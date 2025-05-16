import User from "../models/user.model.js";
import ApiRes from "../service/apires.js";

export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return ApiRes(res, 404, "Database is Empty");
    }

    res.status(200).json({
      success: true,
      count: users.length,
    });
  } catch (error) {
    console.log(error);
    return ApiRes(req, 500, "Internal server Error");
  }
};
export const getsingleUser = async () => {
  const { id } = req.params;
  try {
    if (!id) {
      return ApiRes(req, 400, "Id not found");
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return ApiRes(req, 404, "User Not Found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return ApiRes(req, 500, "Server Error");
  }
};
export const userStatus = async () => {};
