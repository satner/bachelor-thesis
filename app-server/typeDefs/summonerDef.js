import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getSummonerInfo(userId: String!): SummonerData!
    getVisionScore(userId: String!): [VisionScore]
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

  type VisionScore {
    visionScore: Int
    gameCounter: Int
  }
`;
