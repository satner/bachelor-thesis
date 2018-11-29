const mongoose = require('mongoose');

const summonerSchema = new mongoose.Schema({
    summonerInfo: {
        accountId: Number,
        id: Number,
        profileIconId: Number,
        summonerLevel: Number,
        name: String,
    },
    summonerLeagueInfo: {
        tier: String,
        rank: String,
        leaguePoints: Number,
        wins: Number,
        losses: Number,
        veteran: Boolean,
        inactive: Boolean,
        hotStreak: Boolean,
    },
    matches: [{
        lane: String,
        gameId: Number,
        champion: Number
    }],
    summonerMatchDetails: { type : Array , "default" : [] }
}, {
    timestamp: true
});

export default mongoose.model('SummonerSchema', summonerSchema);