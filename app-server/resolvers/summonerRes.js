import { SummonerSchema } from '../models'
import { API_KEY } from '../lol-config'
const _kayn = require('kayn');
const Kayn = _kayn.Kayn;
const REGIONS = _kayn.REGIONS;


const kayn = Kayn(API_KEY)(/* optional config */)


export default {
    Query: {
        getSummonerInfo: async (_source, _args, {dataSources}) => {
            console.log("eeeeeeeeeeee :" + REGIONS.EUROPE)
            kayn.Summoner.by
                .name('PozerasLeeSin')
                .region(REGIONS.EUROPE) // same as 'na'
                .callback(function(unhandledError, summoner) {
                    kayn.Matchlist.by
                        .accountID(summoner.accountId)
                        /* Note that region falls back to default if unused. */
                        .query({
                            season: 11
                        })
                        .then(function(matchlist) {
                            console.log('actual matches:', matchlist.matches)
                            console.log('total number of games:', matchlist.totalGames)
                        })
                        .catch(console.error)
                })

            // return SummonerSchema.findOne({name: _args.summonerName}, (err, data) => {
            //
            //     return data
            // })
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