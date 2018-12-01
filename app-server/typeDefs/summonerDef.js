import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        getSummonerInfo(summonerName: String!): SummonerData!
    }

    extend type Mutation {
        setSummonerInfo(summonerName: String!, server: String!): Boolean
        updateSummonerInfo(summonerName: String!, server: String!): Boolean
    }
    
    type Summoner {
        accountId: Float
        id: Float
        profileIconId: Int
        summonerLevel: Float
        name: String
    }
`