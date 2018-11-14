import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

import summonerV3API from './requests/summonerV3API';
import leagueV3API from './requests/leagueV3API';
import matchV3API from './requests/matchV3API';

import { APP_PORT, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, DB_DS } from './server-config'

mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_DS}:${DB_PORT}/${DB_NAME}`);

const app = express();
app.disable('x-powered-by');
const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    dataSources: () => ({
        summonerDataSource: new summonerV3API(),
        leagueDataSource: new leagueV3API(),
        matchDataSource: new matchV3API()
    })
});

server.applyMiddleware({ app });

app.listen({ port: APP_PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`)
);