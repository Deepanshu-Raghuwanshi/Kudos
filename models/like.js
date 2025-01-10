const mongoose = require("mongoose");

const { Schema } = mongoose;

const likeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    kudo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kudos",
      required: true,
    },
  },
  { timestamps: true }
);

const LikeModel = mongoose.model("like", likeSchema);

module.exports = LikeModel;
