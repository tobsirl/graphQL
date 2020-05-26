import { GraphQLServer, PubSub } from 'graphql-yoga';
import prisma from './prisma';
import { resolvers } from './resolvers/index';

import db from './db';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request,
    };
  },
});

server.start(() => console.log(`The server is up`));
