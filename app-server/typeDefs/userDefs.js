import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getUserInfos(id: String!): User
    getPaginationUsers(
      limit: Int
      skip: Int
      tier: [String]
      roles: [String]
      server: String
      languages: [String]
      winRatio: Int
      avgGold: Int
      avgDamage: Int
      champions: [String]
    ): [User]
    getPaginationNumber(
      tier: [String]
      roles: [String]
      server: String
      languages: [String]
      winRatio: Int
      avgGold: Int
      avgDamage: Int
      champions: [String]
    ): Int
  }

  extend type Mutation {
    addSummoner(id: String!, summoner: String!, server: String!): Boolean
    deleteSummoner(id: String!, summoner: String!, server: String!): Boolean
    login(email: String!, password: String!): String
    signup(
      email: String
      password: String
      languages: [String]
      roles: [String]
    ): Boolean
    forgotPassword(email: String): Boolean
    resetPassword(password: String, token: String): Boolean
    updateUserInfo(
      id: String!
      email: String
      password: String
      languages: [String]
      roles: [String]
    ): Boolean
    deleteUserInfo(token: String): Boolean
  }

  type User {
    _id: String
    email: String
    summoner: [Accounts]
    languages: [String]
    roles: [String]
    latestPatchNumber: String
  }

  type Accounts {
    name: String
    server: String
    tier: String
    profileIconId: Int
    summonerLevel: Int
  }

  type Champion {
    name: String
  }
`;
