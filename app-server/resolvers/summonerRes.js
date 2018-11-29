import { SummonerSchema } from '../models'
import LeagueJs from 'leaguejs';
import { API_KEY, QUEUE, SEASON } from '../lol-config'
const api = new LeagueJs(API_KEY);


export default {
    Query: {
        getSummonerInfo: async (_source, _args) => {
            return SummonerSchema.findOne({name: _args.summonerName}, (err, data) => {
                console.log(data)
                return data
            })
        },
    },
    Mutation: {
        setSummonerInfo: async (_source, _args) => {
            SummonerSchema.findOne({name: _args.summonerName}, async (err, user) => {
                if (user) {
                    console.log('>>> setSummonerInfo resolver: Summoner exist!');
                    return
                }
                console.log('>>> setSummonerInfo resolver: Summoner doesn\'t exist!');
                let matchDetails = [];
                let finalData = {};
                let promisesUntilMatchesList = api.Summoner
                    // Summoner endpoint returns: {... profileId, accountId, id ...}
                    .gettingByName(_args.summonerName, _args.server)
                    // League endpoint returns: {... tier, rank, leaguePoints, wins, losses, veteran, inactive, hotStreak ...}
                    .then(data => {
                        finalData.summonerInfo = data;
                        return api.League.gettingPositionsForSummonerId(data.id, _args.server)
                    })
                    .catch(err => {
                        console.log(">>> setSummonerInfo resolver: League Endpoint Error: " + err);
                    })
                    // Match endpoint returns: list of matches
                    .then(data => {
                        finalData.summonerLeagueInfo = data[1]; // Ston index 0 einai ta flex
                        return api.Match.gettingListByAccount(finalData.summonerInfo.accountId , _args.server, {queue: [QUEUE], season: [SEASON]})
                    })
                    .catch(err => {
                        console.log(">>> setSummonerInfo resolver: Summoner Endpoint Error: " + err);
                    })
                    // Match endpoints: returns matches[... gameId, champion, role, season, queue ...], totalGames, startIndex, endIndex
                    .then(matchList => {
                        return matchList.matches
                    })
                    .catch(err => {
                        console.log(">>> setSummonerInfo resolver: Match Endpoint Error: " + err);
                    })


                promisesUntilMatchesList.then(matchList => {
                    Promise
                        .all(matchList.map(async function (match) {
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
                                    console.log('>>> setSummonerInfo resolver: Match Endpoint Error (details)' + err)
                                })
                        })).then(() => {
                        finalData.summonerMatchDetails = matchDetails;
                        SummonerSchema.create(finalData)
                        console.log('>>> setSummonerInfo resolver: Summoner saved')
                    })
                })

                return true
            });
        },
    }
}