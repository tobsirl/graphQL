import { GraphQLServer } from 'graphql-yoga';

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Customer from './resolvers/Customer';
import Product from './resolvers/Product';
import Review from './resolvers/Review';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: { Query, Mutation, Customer, Product, Review },
  context: {
    db,
  },
});

const PORT = 4000;

server.start(PORT, () => console.log(`Server started on ${PORT}`));
