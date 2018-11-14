import { SummonerSchema } from '../models'

export default {
    Query: {
        getSummonerInfo: async (_source, _args, {dataSources}) => {
            return await dataSources.summonerDataSource.getSummoner(_args.summonerName);
        },
    },
    Mutation: {
        setSummonerInfo: async (_source, _args, {dataSources}) => {

            SummonerSchema.findOne({name: _args.summonerName}, async (err, user) => {
                if (user) {
                    console.log('Summoner exist!')
                } else {
                    console.log('Summoner does not exist');
                    let data = await dataSources.summonerDataSource.getSummoner(_args.summonerName);
                    let data2 = await dataSources.leagueDataSource.getLeagueRank(data.id);
                    let data3 = await dataSources.matchDataSource.getMatches(data.accountId);
                    let finalData = Object.assign({}, data, data2[1], data3);
                    SummonerSchema.create(finalData);
                }
                return true
            });
        },
    }
}