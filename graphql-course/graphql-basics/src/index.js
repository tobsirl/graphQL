import { GraphQLServer } from 'graphql-yoga';
import { users, posts, comments } from './data';
import { v4 as uuidv4 } from 'uuid';

// Scalar types = String, Boolean, Integer, Float, ID

// Type definitions (Schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(user: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(post: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(comment: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int!
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments(parent, args, ctx, info) {
      if (!args.query) return comments;
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      // check if the email is already taken
      const emailTaken = users.some((user) => user.email === args.user.email);

      // throw an error if the email is taken
      if (emailTaken) {
        throw new Error(`Email taken ${args.user.email}`);
      }

      // create the user
      const user = {
        id: uuidv4(),
        ...args.user,
      };

      // save the user
      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      // check if the user exists
      const userIndex = users.findIndex((user) => user.id === args.id);

      // throw an error if the user isn't found
      if (userIndex === -1) throw new Error(`User not found`);

      // delete the user using the index
      const deletedUsers = users.splice(userIndex, 1);

      posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });

      comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      // check if the user exists
      const userExists = users.some((user) => user.id === args.post.author);

      if (!userExists) throw new Error(`User not found`);

      const post = {
        id: uuidv4(),
        ...args.post,
      };

      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) throw new Error(`Post not found`);

      const deletedPosts = posts.splice(postIndex, 1);

      comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, args, ctx, info) {
      // check if the user exists
      const userExists = users.some((user) => user.id === args.comment.author);
      const postExists = posts.some(
        (post) => post.id === args.comment.post && post.published === true
      );

      if (!userExists || !postExists) throw new Error(`User not found`);

      const comment = {
        id: uuidv4(),
        ...args.comment,
      };

      comments.push(comment);

      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log(`The server is up`));
