import { GraphQLServer } from 'graphql-yoga';

// Scalar types = String, Boolean, Integer, Float, ID 
const

// Type definitions (Schema)
const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
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
