const Kudos = require("../models/kudos");
const LikeModel = require("../models/like");
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
    console.log(req.query);
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        code: 400,
        message: "User ID is required",
        status: "failure",
        data: {},
      });
    }

    const kudos = await Kudos.find()
      .populate("givenBy", "name")
      .populate("givenTo", "name");

    const kudosWithLikeInfo = await Promise.all(
      kudos.map(async (kudo) => {
        const isLiked = await LikeModel.exists({ kudo: kudo._id, user: id });
        return {
          ...kudo.toObject(),
          like: Boolean(isLiked),
        };
      })
    );

    return res.status(200).json({
      code: 200,
      message: "Kudos list fetched successfully",
      status: "success",
      data: kudosWithLikeInfo,
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
    const { kudoId, userId } = req.body;

    console.log(req.body);

    // Check if the Kudo exists
    const kudo = await Kudos.findById(kudoId);
    if (!kudo) {
      return res.status(404).json({
        code: 404,
        message: "Kudo not found",
        status: "failure",
        data: {},
      });
    }

    // Check if the user already liked the Kudo
    const existingLike = await LikeModel.findOne({
      kudo: kudoId,
      user: userId,
    });

    if (existingLike) {
      // If the user has already liked the Kudo, delete the like
      await LikeModel.deleteOne({ _id: existingLike._id });

      return res.status(200).json({
        code: 200,
        message: "Kudo like removed successfully",
        status: "success",
        data: {},
      });
    }

    // Create a new like entry
    const like = new LikeModel({
      user: userId,
      kudo: kudoId,
    });
    await like.save();

    return res.status(201).json({
      code: 201,
      message: "Kudo liked successfully",
      status: "success",
      data: like,
    });
  } catch (error) {
    console.log(error);
    console.error("Error liking Kudo:", error.message);
    return res.status(500).json({
      code: 500,
      message: "An error occurred while liking the Kudo.",
      status: "failure",
      data: { error: error.message },
    });
  }
};

const getAnalyticsData = async (req, res) => {
  try {
    // Fetch all kudos data
    const kudos = await Kudos.find()
      .populate("givenBy", "name")
      .populate("givenTo", "name");

    // Aggregate data for the chart
    const badgeCounts = kudos.reduce((acc, kudo) => {
      acc[kudo.badge] = (acc[kudo.badge] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(badgeCounts).map((badge) => ({
      badge,
      count: badgeCounts[badge],
    }));

    // Aggregate data for the leaderboard
    const userKudosCounts = kudos.reduce((acc, kudo) => {
      const userName = kudo.givenTo.name;
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {});

    const leaderboardData = Object.keys(userKudosCounts)
      .map((user) => ({
        name: user,
        kudosReceived: userKudosCounts[user],
      }))
      .sort((a, b) => b.kudosReceived - a.kudosReceived);

    // Fetch like count for each kudo and find the most liked post
    const mostLikedPost = await Promise.all(
      kudos.map(async (kudo) => {
        // Find the number of likes for each Kudo
        const likeCount = await LikeModel.countDocuments({
          kudo: kudo._id,
        });

        return {
          kudoId: kudo._id,
          givenBy: kudo.givenBy.name,
          badge: kudo.badge,
          givenTo: kudo.givenTo.name,
          message: kudo.reason_for_kudos,
          likesCount: likeCount,
        };
      })
    );

    // Find the most liked post from the fetched like counts
    const mostLikedKudo = mostLikedPost.reduce((max, kudo) => {
      if (!max || max.likesCount < kudo.likesCount) {
        return kudo;
      }
      return max;
    }, null);

    return res.status(200).json({
      code: 200,
      message: "Analytics data fetched successfully",
      status: "success",
      data: {
        chartData,
        leaderboardData,
        mostLikedPost: mostLikedKudo || null,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error.message);

    return res.status(500).json({
      code: 500,
      message: "An error occurred while fetching analytics data",
      status: "failure",
      data: { error: error.message },
    });
  }
};

// const getAnalyticsData = async (req, res) => {
//   try {
//     // Fetch all kudos data
//     const kudos = await Kudos.find()
//       .populate("givenBy", "name")
//       .populate("givenTo", "name");

//     // Aggregate data for the chart
//     const badgeCounts = kudos.reduce((acc, kudo) => {
//       acc[kudo.badge] = (acc[kudo.badge] || 0) + 1;
//       return acc;
//     }, {});

//     const chartData = Object.keys(badgeCounts).map((badge) => ({
//       badge,
//       count: badgeCounts[badge],
//     }));

//     // Aggregate data for the leaderboard
//     const userKudosCounts = kudos.reduce((acc, kudo) => {
//       const userName = kudo.givenTo.name;
//       acc[userName] = (acc[userName] || 0) + 1;
//       return acc;
//     }, {});

//     const leaderboardData = Object.keys(userKudosCounts)
//       .map((user) => ({
//         name: user,
//         kudosReceived: userKudosCounts[user],
//       }))
//       .sort((a, b) => b.kudosReceived - a.kudosReceived);

//        const mostLikedPost = kudos
//       .filter((kudo) => kudo.like)
//       .reduce((max, kudo) => {
//         if (!max || max.likes < (kudo.likes || 0)) {
//           return {
//             givenBy: kudo.givenBy.name,
//             badge: kudo.badge,
//             givenTo: kudo.givenTo.name,
//             message: kudo.reason_for_kudos,
//             likes: kudo.likes || 0,
//           };
//         }
//         return max;
//       }, null);

//     return res.status(200).json({
//       code: 200,
//       message: "Analytics data fetched successfully",
//       status: "success",
//       data: {
//         chartData,
//         leaderboardData,
//          mostLikedPost: mostLikedPost || null,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching analytics data:", error.message);

//     return res.status(500).json({
//       code: 500,
//       message: "An error occurred while fetching analytics data",
//       status: "failure",
//       data: { error: error.message },
//     });
//   }
// };

module.exports = { createKudos, getKudos, handleKudoLike, getAnalyticsData };
