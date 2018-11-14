const mongoose = require('mongoose');

const summonerSchema = new mongoose.Schema({
    accountId: Number,
    id: Number,
    profileIconId: Number,
    summonerLevel: Number,
    name: String,
    tier: String,
    rank: String,
    leaguePoints: Number,
    wins: Number,
    losses: Number,
    veteran: Boolean,
    inactive: Boolean,
    hotStreak: Boolean,
    matches: [{
        lane: String,
        gameId: Number,
        champion: Number
    }],
    matchDetails: { type : Array , "default" : [] }
}, {
    timestamp: true
});

export default mongoose.model('SummonerSchema', summonerSchema);