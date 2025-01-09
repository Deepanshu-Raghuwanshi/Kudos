const Kudos = require("../models/kudos");
const userModel = require("../models/user"); // Adjust the path as needed

const createKudos = async (req, res) => {
  try {
    const { byUser, toUser, badge, reason_for_kudos } = req?.body?.data;
    console.log(req.body, "kudo");

    const validBadges = [
      "helping_hand",
      "excellence",
      "above_and_beyond",
      "client_focus",
    ];

    if (!validBadges.includes(badge)) {
      return res.status(400).json({
        code: 400,
        message: "Invalid badge name",
        status: "failure",
        data: {},
      });
    }

    if (!reason_for_kudos || !byUser || !toUser) {
      return res.status(400).json({
        code: 400,
        message: "Missing required fields",
        status: "failure",
        data: {},
      });
    }

    const byUserRecord = await userModel.findOne({
      name: byUser.toLowerCase(),
    });
    const toUserRecord = await userModel.findOne({
      name: toUser.toLowerCase(),
    });

    if (!byUserRecord || !toUserRecord) {
      return res.status(404).json({
        code: 404,
        message: "One or both users not found",
        status: "failure",
        data: {},
      });
    }

    const byUserId = byUserRecord._id;
    const toUserId = toUserRecord._id;

    const kudos = new Kudos({
      givenBy: byUserId,
      givenTo: toUserId,
      badge: badge,
      reason_for_kudos: reason_for_kudos,
    });

    await kudos.save();

    return res.status(201).json({
      code: 201,
      message: "Kudos successfully created",
      status: "success",
      data: kudos,
    });
  } catch (error) {
    console.error("Error creating kudos:", error.message);

    return res.status(500).json({
      code: 500,
      message: "An error occurred while creating the kudos.",
      status: "failure",
      data: { error: error.message },
    });
  }
};

const getKudos = async (req, res) => {
  try {
    const kudos = await Kudos.find()
      .populate("givenBy", "name")
      .populate("givenTo", "name");

    return res.status(200).json({
      code: 200,
      message: "Kudos list fetched successfully",
      status: "success",
      data: kudos,
    });
  } catch (error) {
    console.error("Error fetching kudos:", error.message);

    return res.status(500).json({
      code: 500,
      message: "An error occurred while fetching kudos",
      status: "failure",
      data: { error: error.message },
    });
  }
};
const handleKudoLike = async (req, res) => {
  try {
    const { id } = req.body;

    console.log(id);

    const kudo = await Kudos.findByIdAndUpdate(
      id,
      { like: true },
      { new: true }
    );

    if (!kudo) {
      return res.status(404).json({
        code: 404,
        message: "Kudo not found",
        status: "failure",
        data: {},
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Kudo successfully updated",
      status: "success",
      data: kudo,
    });
  } catch (error) {
    console.error("Error updating kudo:", error.message);

    return res.status(500).json({
      code: 500,
      message: "An error occurred while updating the kudo.",
      status: "failure",
      data: { error: error.message },
    });
  }
};

module.exports = { createKudos, getKudos, handleKudoLike };
