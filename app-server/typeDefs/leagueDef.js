import { gql } from 'apollo-server-express'

export default gql`    
    type League {
        wins: Int
        losses: Int
        veteran: Boolean
        tier: String
        rank: String
        leaguePoints: Int
    }
`