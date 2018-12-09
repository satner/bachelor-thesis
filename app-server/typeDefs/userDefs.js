import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        getAllUsers(limit: Int, skip: Int): [User]
        getTotalNumberUsers: Int
    }

    extend type Mutation {
        addSummoner(summoner: String!, server: String!): Accounts
        login(email: String!, password: String!): String
        signup(email: String, password: String, languages: [String]): Boolean
        updateUserInfo(email: String, password: String, languages: [String], token: String): Boolean
        deleteUserInfo(token: String): Boolean
    }

    type User {
        email: String
        summoner: [Accounts]
        languages: [String]
    }
    
    type Accounts {
      name: String
      server: String
    }
`