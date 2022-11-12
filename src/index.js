const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');
const path = require("path");
const typeDefs = gql(readFileSync(path.resolve(__dirname, "./schema.graphql"), { encoding: 'utf-8' }));
const resolvers = require('./resolvers');
const TrackAPI = require('./datasources/track-api');

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    dataSources: () => {
      return {
        trackAPI: new TrackAPI(),
      };
    },
  });
  const { url, port } = await server.listen();
  console.log(`
    🚀  Server is running
    🔉  Listening on port ${port}
    📭  Query at ${url}
  `)
}
startApolloServer(typeDefs, resolvers);