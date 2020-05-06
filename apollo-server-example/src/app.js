const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
  }

  type Query {
    message: String!
    users: [User!]!
  }
`;

const resolvers = {
  Query: {
    message: () => {
      return 'Hello World!';
    },
    users: () => {
      return [{
        id: '001',
        name: "Andrew",
        age: 23
      }]
    }
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
