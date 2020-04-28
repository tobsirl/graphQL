const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    rating: Float!
    alive: Boolean!
  }
`;

const resolvers = {
  Query: {
    id() {
      return `123abc`;
    },
    name() {
      return `Thomas`;
    },
    age() {
      return 23;
    },
    rating() {
      return 4.5;
    },
    alive() {
      return true;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

const PORT = 4000;

server.start(PORT, () => console.log(`Server started on ${PORT}`));
