import { GraphQLServer } from 'graphql-yoga';
import { users, posts } from './data';

// Scalar types = String, Boolean, Integer, Float, ID

// Type definitions (Schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
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
    author: User!
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
    posts(parent, args, ctx, info) {
      if (!args.query) return posts;

      return posts.filter((post) => {
        return (
          post.title
            .toLocaleLowerCase()
            .includes(args.query.toLocaleLowerCase()) ||
          post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        );
      });
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
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log(`The server is up`));
