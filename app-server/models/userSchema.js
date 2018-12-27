const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true
    },
    password: String,
    summoner: [
      {
        name: String,
        server: String,
        tier: String,
        profileIconId: Number,
        summonerLevel: Number,
        winRatio: Number
      }
    ],
    languages: [String],
    roles: [String],
    resetPasswordToken: String
  },
  {
    timestamp: true
  }
);

export default mongoose.model("userSchema", userSchema);
