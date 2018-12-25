import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getSummonerInfo(userId: String!): SummonerData!
    getVisionScore(userId: String!): [AreaMultiGraph]
    getKDAPerGame(userId: String!): [KDA]
    getAvgStats(userId: String!): AvgStats
    getKillsStats(userId: String!): [killsStats]
    getDamageDealtToChampions(userId: String!): [AreaMultiGraph]
    getCreepsPerMinDeltas(userId: String!): [AreaMultiGraphFloat]
    getXpPerMinDeltas(userId: String!): [AreaMultiGraphFloat]
    getGoldPerMinDeltas(userId: String!): [AreaMultiGraphFloat]
    getCalendarStats(userId: String!): [Calendar]
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

  type Calendar {
    day: String
    value: Int
  }

  type AvgStats {
    winRatio: Int
    goldAvg: Int
    damageAvg: Int
  }
`;
