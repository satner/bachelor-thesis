const mongoose = require("mongoose");

const summonerSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    summonerInfo: {
      accountId: Number,
      id: Number,
      profileIconId: Number,
      summonerLevel: Number,
      name: String,
      server: String
    },
    summonerLeagueInfo: {
      tier: String,
      rank: String,
      leaguePoints: Number,
      wins: Number,
      losses: Number,
      veteran: Boolean,
      inactive: Boolean,
      hotStreak: Boolean
    },
    matchesTimeline: [
      {
        day: String,
        value: Number
      }
    ],
    totalGames: Number,
    startIndex: Number,
    endIndex: Number,
    summonerMatchDetails: { type: Array, default: [] }
  },
  {
    timestamp: true
  }
);

export default mongoose.model("SummonerSchema", summonerSchema);
