import { SummonerSchema } from '../models'
import { API_KEY, QUEUE, SEASON } from '../lol-config'
const _ = require('lodash');
import LeagueJs from 'leaguejs';
const api = new LeagueJs(API_KEY,{
    // TODO: test burst mode
    caching: {
        isEnabled: true,
        defaults: {stdTTL: 120} // add a TTL to all Endpoints
    }
});

export default {
    Query: {
        getSummonerInfo: async (_source, _args) => {
            return await SummonerSchema.findOne({'summonerInfo.name': _args.summonerName})
        },
    },
    Mutation: {
        setSummonerInfo: async (_source, _args) => {
            // TODO: check if summoner exist API-side
            SummonerSchema.findOne({'summonerInfo.name': _args.summonerName}, async (err, user) => {
                if (user) {
                    console.log('🤷 Summoner exist!');
                    return
                }
                let matchDetails = [];
                let finalData = {};
                let promisesUntilMatchesList = api.Summoner
                    // Summoner endpoint returns: {... profileId, accountId, id ...}
                    .gettingByName(_args.summonerName, _args.server)
                    .catch(err =>{
                        console.log('🤷 Summoner doesn\'t exist!' + err) // TODO: handle status code
                    })
                    // League endpoint returns: {... tier, rank, leaguePoints, wins, losses, veteran, inactive, hotStreak ...}
                    .then(data => {
                        finalData.summonerInfo = data;
                        return api.League.gettingPositionsForSummonerId(data.id, _args.server)
                    })
                    .catch(err => {
                        console.error(">>> setSummonerInfo resolver: League Endpoint Error: " + err);
                    })
                    // Match endpoint returns: list of matches
                    .then(data => {
                        finalData.summonerLeagueInfo = data[1]; // Ston index 0 einai ta flex
                        return api.Match.gettingListByAccount(finalData.summonerInfo.accountId , _args.server, {queue: [QUEUE], season: [SEASON]})
                    })
                    .catch(err => {
                        console.error(">>> setSummonerInfo resolver: Match Endpoint Error: " + err);
                    })
                    // Match endpoints: returns matches[... gameId, champion, role, season, queue ...], totalGames, startIndex, endIndex
                    .then(matchList => {
                        finalData.startIndex = matchList.startIndex;
                        finalData.endIndex = matchList.endIndex;
                        finalData.totalGames = matchList.totalGames;
                        return matchList.matches
                    })
                    .catch(err => {
                        console.error(">>> setSummonerInfo resolver: Match Endpoint Error: " + err);
                    })

                    promisesUntilMatchesList.then(matchList => {
                        Promise.all(matchList.map(async function (match) {
                            await api.Match.gettingById(match.gameId, _args.server)
                                .then( data => {
                                    // Pernw to participantid tou summoner
                                    let summonerID =  data.participantIdentities.filter(function(summoner) {
                                        return summoner.player.summonerName === _args.summonerName
                                    });

                                    let temp = data.participants.filter(function(summoner) {
                                        return summoner.participantId === summonerID[0].participantId
                                    });
                                    matchDetails.push(temp[0])
                                })
                                .catch(err => {
                                    console.error('>>> setSummonerInfo resolver: Match Endpoint Error (details)' + err)
                                })
                        })).then(() => {
                            finalData.summonerMatchDetails = matchDetails;
                            SummonerSchema.create(finalData)
                            console.log('💪 Summoner saved!')
                        })
                    })
            });
        },
        // TODO: check start, end and totalgames index
        updateSummonerInfo: (_source, _args) => {
            SummonerSchema.findOne({'summonerInfo.name': _args.summonerName}, (err, result) => {
                let matchDetails = [];
                api.Match.gettingListByAccount(result.summonerInfo.accountId, _args.server, {queue: [QUEUE], season: [SEASON], beginIndex: result.endIndex})
                    .then(matchList => {
                        return matchList
                    })
                    .then(matchesList => {
                        Promise.all(matchesList.matches.map(async function (match) {
                            await api.Match.gettingById(match.gameId, _args.server)
                                .then( data => {
                                    // Pernw to participantid tou summoner
                                    let summonerID =  data.participantIdentities.filter(function(summoner) {
                                        return summoner.player.summonerName === _args.summonerName
                                    });

                                    let temp = data.participants.filter(function(summoner) {
                                        return summoner.participantId === summonerID[0].participantId
                                    });
                                    matchDetails.push(temp[0])
                                })
                                .catch(err => {
                                    console.error('>>> setSummonerInfo resolver: Match Endpoint Error (details)' + err)
                                })
                        })).then(() => {
                            SummonerSchema.updateOne({_id: result._id}, {$push: { summonerMatchDetails: matchDetails }, $inc: { endIndex: 100 }, totalGames: matchesList.totalGames}, {safe: true, upsert: true}, function(err, model) {
                                if (err) console.error('>>> setSummonerInfo resolver: Update Error')
                                console.log('💪 Summoner updated')
                            })

                        })
                    })
            })
        },

        deleteSummonerInfo: async (_source, _args) => {
            let doc = await SummonerSchema.findOneAndDelete({'summonerInfo.name': _args.summonerName})
            if (doc) {
                console.log('🗑️ Summoner deleted!')
                return true
            }
            return false
        },
    }
}