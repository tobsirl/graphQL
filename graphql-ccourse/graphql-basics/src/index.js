import { GraphQLServer } from 'graphql-yoga';

// Scalar types = String, Boolean, Integer, Float, ID

// Demo user data
const users = [
  {
    id: '1',
    name: 'Paul',
    email: 'paul@example.com',
    age: 24,
  },
  {
    id: '2',
    name: 'Keith',
    email: 'keith@example.com',
    age: 34,
  },
  {
    id: '3',
    name: 'Simon',
    email: 'simon@example.com',
    age: 28,
  },
];

// Type definitions (Schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
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
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) =>
        user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      );
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
