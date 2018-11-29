import { SummonerSchema } from '../models'
import LeagueJs from 'leaguejs';
import { API_KEY, QUEUE, SEASON } from '../lol-config'
const api = new LeagueJs(API_KEY);


export default {
    Query: {
        // TODO: refactor magic numbers
        getSummonerInfo: async (_source, _args) => {
            let matchDetails = [];
            let semiData = {};
            let promisesUntilMatchesList = api.Summoner
                .gettingByName(_args.summonerName, _args.server)
                // Summoner endpoint
                .then(data => {
                    semiData.summonerInfo = data;
                    return api.Match.gettingListByAccount(data.accountId , _args.server, {queue: [QUEUE], season: [SEASON]})
                })
                .catch(err => {
                    console.log(">>> Summoner Endpoint Error: " + err);
                })
                // Match endpoints: returns matches[... gameId, champion, role, season, queue ...], totalGames, startIndex, endIndex
                .then(matchList => {
                    return matchList.matches
                })
                .catch(err => {
                    console.log(">>> Match Endpoint Error: " + err);
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
                            console.log('>>> Match Endpoint Error (details)')
                        })
                })).then(() => {
                    console.log('kappa reality of the gods: ' + matchDetails.length)
                })
            })
        },
    },
    Mutation: {
        setSummonerInfo: async (_source, _args, {dataSources}) => {

            SummonerSchema.findOne({name: _args.summonerName}, async (err, user) => {
                if (user) {
                    console.log('Summoner exist!')
                    return
                }

                console.log('Summoner does not exist');
                let summonerData = await dataSources.summonerDataSource.getSummoner(_args.summonerName);
                let leagueData = await dataSources.leagueDataSource.getLeagueRank(summonerData.id);
                let matchData = await dataSources.matchDataSource.getMatches(summonerData.accountId);
                let finalData = Object.assign({}, summonerData, leagueData[1], matchData);


                let results = [];
                let requests = finalData.matches.map(async function (match) {
                    let data = await dataSources.matchDetailDataSource.getMatcheDetails(match.gameId);

                    let summonerID =  data.participantIdentities.filter(function(summoner) {
                        return summoner.player.summonerName === _args.summonerName
                    });
                    console.log(summonerID[0].participantId)

                    let temp = data.participants.filter(function(summoner) {
                        return summoner.participantId === summonerID[0].participantId
                    });
                    results.push(temp[0])
                });

                /*
                Perimeno na teliosoun ola ta request gia ta match details
                kai meta tha ta insert sto database
                */
                // TODO: clean trash fields of matchDetails
                Promise.all(requests).then(() => {
                    (finalData.matchDetails = results ) &&  SummonerSchema.create(finalData)
                });
                return true
            });
        },
    }
}