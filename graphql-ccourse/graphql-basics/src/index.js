import { GraphQLServer } from 'graphql-yoga';

// Scalar types = String, Boolean, Integer, Float, ID

// Type definitions (Schema)
const typeDefs = `
  type Query {
    greeting(name: String): String!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, { name }, ctx, info) {
      return `Welcome to GraphQL ${name}`;
    },
    me() {
      return {
        id: 'abc123',
        name: 'Mike',
        email: 'mike@gmail.com',
        age: 18,
      };
    },
    post() {
      return {
        id: '123abc',
        title: 'GraphQL is great',
        body: 'Having fun learning GraphQL',
        published: true,
      };
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log(`The server is up`));
