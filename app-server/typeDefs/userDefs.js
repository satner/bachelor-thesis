import {gql} from 'apollo-server-express'

export default gql`
    extend type Query {
        getAllUsers(limit: Int, skip: Int): [User]
        getTotalNumberUsers: Int
        getUserInfos(id: String!): User
    }

    extend type Mutation {
        addSummoner(id: String!, summoner: String!, server: String!): Boolean
        deleteSummoner(id: String!, summoner: String!, server: String!): Boolean
        login(email: String!, password: String!): String
        signup(email: String, password: String, languages: [String], roles: [String]): Boolean
        updateUserInfo(id: String!, email: String, password: String, languages: [String], roles: [String]): Boolean
        deleteUserInfo(token: String): Boolean
    }

    type User {
        _id: String
        email: String
        summoner: [Accounts]
        languages: [String]
        roles: [String]
    }
    
    type Accounts {
      name: String
      server: String
    }
`