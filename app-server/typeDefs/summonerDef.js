import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getSummonerInfo(userId: String!): SummonerData!
    getVisionScore(
      userId: String!
      summonerName: String!
      server: String!
    ): [AreaMultiGraph]
    getKDAPerGame(
      userId: String!
      summonerName: String!
      server: String!
    ): [KDA]
    getAvgStats(
      userId: String!
      summonerName: String!
      server: String!
    ): AvgStats
    getKillsStats(
      userId: String!
      summonerName: String!
      server: String!
    ): [killsStats]
    getDamageDealtToChampions(
      userId: String!
      summonerName: String!
      server: String!
    ): [AreaMultiGraph]
    getCreepsPerMinDeltas(
      userId: String!
      summonerName: String!
      server: String!
    ): [AreaMultiGraphFloat]
    getXpPerMinDeltas(
      userId: String!
      summonerName: String!
      server: String!
    ): [AreaMultiGraphFloat]
    getGoldPerMinDeltas(
      userId: String!
      summonerName: String!
      server: String!
    ): [AreaMultiGraphFloat]
    getCalendarStats(
      userId: String!
      summonerName: String!
      server: String!
    ): Calendar
    getRadarStats(
      userId: String!
      summonerName: String!
      server: String!
    ): [Radar]
    getFiveMostPlayedChampions(
      userId: String!
      summonerName: String!
      server: String!
    ): [MostPlayed]
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

  type AvgStats {
    winRatio: Int
    goldAvg: Int
    damageAvg: Int
  }

  type Calendar {
    maxDay: String
    minDay: String
    timeline: [Time]
  }

  type Time {
    day: String
    value: Int
  }

  type Radar {
    type: String
    value: Int
  }

  type MostPlayed {
    name: String
    wins: Int
    losses: Int
    winsColor: String
    lossesColor: String
  }
`;
