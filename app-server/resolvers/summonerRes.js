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
    }
}