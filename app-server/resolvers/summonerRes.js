import { SummonerSchema } from '../models'

export default {
    Query: {
        getSummonerInfo: async (_source, _args, {dataSources}) => {
            return await dataSources.summonerDataSource.getSummoner(_args.summonerName);
        },
    },
    Mutation: {
        setSummonerInfo: async (_source, _args, {dataSources}) => {
            SummonerSchema.findOne({name: _args.summonerName}, (err, user) => {
                if (user) {
                    return false
                }
            });
            // TODO: na ginete check ean to summoner name iparxei idi sto database
            // TODO: na ginete store to summoner name olo lower case
            let data = await dataSources.summonerDataSource.getSummoner(_args.summonerName);
            let data2 = await dataSources.leagueDataSource.getLeagueRank(data.id);
            let data3 = await dataSources.matchDataSource.getMatches(data.accountId);
            let finalData = Object.assign({}, data, data2[1], data3);
            // console.log(finalData);
            SummonerSchema.create(finalData);
            return true
        },
    }
}