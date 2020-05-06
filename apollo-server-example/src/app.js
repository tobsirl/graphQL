const { ApolloServer, gql } = require('apollo-server');

const users = [
  {
    id: '001',
    name: 'Andrew',
    age: 23,
  },
  {
    id: '002',
    name: 'James',
    age: 24,
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
  }

  type Query {
    message: String!
    user(id: ID!): User!
    users: [User!]!
  }
`;

const resolvers = {
  Query: {
    message: () => {
      return 'Hello World!';
    },
    user: (parent, { id }, ctx, info) => {
      return users.find((user) => user.id === id);
    },
    users: () => {
      return users;
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
