import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        getUserInfo(userName: String!): User!
        getAllUsers(limit: Int, skip: Int): [User]
        getTotalNumberUsers: Int
    }

    extend type Mutation {
        login(email: String!, password: String!): String
        signup(email: String, password: String, server: String , summoner: String, languages: [String]): Boolean
        updateUserInfo(userName: String!): Boolean
        deleteUserInfo(email: String!): Boolean
    }

    type User {
        email: String
        server : String
        languages: [String]
        summoner: String
    }
`