import { GraphQLServer } from 'graphql-yoga';

// Scalar types = String, Boolean, Integer, Float, ID

// Type definitions (Schema)
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    title() {
      return `Fender CD-60SCE Blk WN`;
    },
    price() {
      return 266;
    },
    releaseYear() {
      return 2018;
    },
    rating() {
      return 4.7;
    },
    inStock() {
      return true;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log(`The server is up`));
