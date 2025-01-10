const userModel = require("../models/user");

const saveUserName = async (req, res) => {
  try {
    const name = req.body.name?.toLowerCase();

    if (!name) {
      return res.status(400).json({
        code: 400,
        message: "Name is required.",
        status: "failure",
        data: {},
      });
    }

    const existingUser = await userModel.findOne({ name });
    if (existingUser) {
      return res.status(200).json({
        code: 200,
        message: "Name already exists.",
        status: "success",
        data: { id: existingUser._id, name: existingUser.name },
      });
    }

    const newUser = new userModel({ name });
    await newUser.save();

    return res.status(201).json({
      code: 201,
      message: "Name saved successfully.",
      status: "success",
      data: { id: newUser._id, name: newUser.name },
    });
  } catch (error) {
    console.error("Error saving name:", error);

    return res.status(500).json({
      code: 500,
      message: "An error occurred while saving the name.",
      status: "failure",
      data: { error: error.message },
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const currentUser = req.query.user?.toLowerCase();
    console.log(currentUser, "currentUser");

    if (!currentUser) {
      return res.status(400).json({
        code: 400,
        message: "Query parameter 'name' is required.",
        status: "failure",
        data: {},
      });
    }

    const users = await userModel.find({ name: { $ne: currentUser } });

    return res.status(200).json({
      code: 200,
      message: "Users retrieved successfully.",
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);

    return res.status(500).json({
      code: 500,
      message: "An error occurred while retrieving users.",
      status: "failure",
      data: { error: error.message },
    });
  }
};

module.exports = { saveUserName, getUsers };
