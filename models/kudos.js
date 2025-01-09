const mongoose = require("mongoose");

const { Schema } = mongoose;

const kudosSchema = new Schema(
  {
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    givenTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    badge: {
      type: String,
      enum: ["helping_hand", "excellence", "above_and_beyond", "client_focus"],
      required: true,
    },
    like: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const KudosModel = mongoose.model("kudos", kudosSchema);

module.exports = KudosModel;
