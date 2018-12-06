import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        getUserInfo(userName: String!): User!
        getAllUsers: [User]
    }

    extend type Mutation {
        signup(email: String, password: String, server: String , summoner: String, languages: [Lang]): Boolean
        updateUserInfo(userName: String!): Boolean
        deleteUserInfo(email: String!): Boolean
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
    
    input Lang {
        lang: String
    }
`