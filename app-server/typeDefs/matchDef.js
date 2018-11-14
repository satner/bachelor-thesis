import { gql } from 'apollo-server-express'

export default gql`
    type Match {
        lane: String
        gameId: String
        champion: String
    }
`