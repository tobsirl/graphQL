import { GraphQLServer } from 'graphql-yoga';

// Type definitions (Schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query!';
    },
    name() {
      return 'Paul Tobin';
    },
    location() {
      return 'Ireland';
    },
    bio() {
      return `Software Developer`;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log(`The server is up`));
