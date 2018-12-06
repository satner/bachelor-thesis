import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        getUserInfo(userName: String!): User!
        getAllUsers: [User]
    }

    extend type Mutation {
        setUserInfo(email: String, password: String, server: String , summoner: String, languages: [Languages]): Boolean
        updateUserInfo(userName: String!): Boolean
        deleteUserInfo(userName: String!): Boolean
    }

    type User {
        email: String
        server : String
        languages: [Languages]
        summoner: String
    }
    
    type Languages {
        lang: String
    }
`