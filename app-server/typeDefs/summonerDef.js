import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getSummonerInfo(userId: String!): SummonerData!
    getVisionScore(userId: String!): [AreaMultiGraph]
    getKDAPerGame(userId: String!): [KDA]
    getWinRatio(userId: String!): Float
    getKillsStats(userId: String!): [killsStats]
    getDamageDealtToChampions(userId: String!): [AreaMultiGraph]
    getCreepsPerMinDeltas(userId: String!): [AreaMultiGraphFloat]
    getXpPerMinDeltas(userId: String!): [AreaMultiGraphFloat]
    getGoldPerMinDeltas(userId: String!): [AreaMultiGraphFloat]
  }

  extend type Mutation {
    updateSummonerInfo(summonerName: String!, server: String!): Boolean
  }

  type Summoner {
    accountId: Float
    id: Float
    profileIconId: Int
    summonerLevel: Float
    name: String
  }

  type AreaMultiGraph {
    type: String
    value: Int
    gameCounter: Int
  }

  type AreaMultiGraphFloat {
    type: String
    value: Float
    gameCounter: Int
  }
  type KDA {
    kda: Float
    gameCounter: Int
  }

  type killsStats {
    killType: String
    value: Int
  }
`;
