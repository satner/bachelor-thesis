import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        getSummonerInfo(summonerName: String!): Summoner!
    }

    extend type Mutation {
        setSummonerInfo(summonerName: String!): Boolean
    }
    
    type Summoner {
        accountId: Float
        id: Float
        profileIconId: Int
        summonerLevel: Float
        name: String
    }
`