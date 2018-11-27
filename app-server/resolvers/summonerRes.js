import { SummonerSchema } from '../models'

import LeagueJs from 'leaguejs';
import { API_KEY } from '../lol-config'
const api = new LeagueJs(API_KEY);


export default {
    Query: {
        getSummonerInfo: async (_source, _args, {dataSources}) => {
            api.Summoner
                .gettingByName(_args.summonerName, 'eun1')
                .then(data => {
                    'use strict';
                    console.log(data);
                    return data
                })
                .catch(err => {
                    'use strict';
                    console.log(err);
                });

            api.Match.gettingListByAccount(1973922219692704 , 'eun1', {queue: [420], season: [11]})
                .then(data => {
                    'use strict';
                    console.log(data.matches.length);
                    return data
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