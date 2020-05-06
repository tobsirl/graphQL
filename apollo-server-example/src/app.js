const { ApolloServer, gql } = require('apollo-server');
const { v4 } = require('uuid');

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
    users(query: String): [User]!
  }

  type Mutation {
    createUser(name: String!, age: Int!): User!
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
    users: (parent, { query }, ctx, info) => {
      if (!query) return users;
      return users.filter((user) => user.name.includes(query));
    },
  },
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const { name, age } = args;
      const id = v4();

      const newUser = {
        id,
        name,
        age,
      };

      users.push(newUser);

      return newUser;
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
