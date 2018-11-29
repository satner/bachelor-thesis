import { gql } from 'apollo-server-express'
const GraphQLJSON = require('graphql-type-json');

export default gql`
    scalar JSON
    
    type Match {
        championId: Int
        spell1Id: Int
        spell2Id: Int
        stats: Stats
        timeline: Timeline
    }
    
    type Stats {
        win: Boolean
        kills: Int
        deaths: Int
        assists: Int
        doubleKills: Int
        tripleKills: Int
        quadraKills: Int
        pentaKills: Int
        totalDamageDealt: Int
        magicDamageDealt: Int
        physicalDamageDealt: Int
        trueDamageDealt: Int
        totalDamageDealtToChampions: Int
        magicDamageDealtToChampions: Int
        physicalDamageDealtToChampions: Int
        trueDamageDealtToChampions: Int
        damageDealtToObjectives: Int
        damageDealtToTurrets: Int
        visionScore: Int
        totalDamageTaken: Int
        magicalDamageTaken: Int
        physicalDamageTaken: Int
        trueDamageTaken: Int
        goldEarned: Int
        totalMinionsKilled: Int
        champLevel: Int
        wardsPlaced: Int
        wardsKilled: Int
        firstBloodKill: Boolean
        firstTowerKill: Boolean
        firstInhibitorAssist: Boolean
    }
    
    type Timeline {
        creepsPerMinDeltas: JSON
        xpPerMinDeltas: JSON
        goldPerMinDeltas: JSON
        csDiffPerMinDeltas: JSON
        xpDiffPerMinDeltas: JSON
        damageTakenPerMinDeltas: JSON
        damageTakenDiffPerMinDeltas: JSON
        role: String
        lane: String
    }
`