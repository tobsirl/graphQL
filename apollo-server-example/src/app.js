const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    message: String!
  }
`;

const resolvers = {
  Query: {
    message: () => {
      return 'Hello World!';
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen({ port: 4000 })
  .then((res) => console.log(`The server is listening at ${res.url}`))
  .catch((err) => console.log(err.message));
