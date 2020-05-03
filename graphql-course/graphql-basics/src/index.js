import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

import db from './db';

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }
      return db.users.filter((user) =>
        user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      );
    },
    posts(parent, args, { db }, info) {
      if (!args.query) return posts;

      return db.posts.filter((post) => {
        return (
          post.title
            .toLocaleLowerCase()
            .includes(args.query.toLocaleLowerCase()) ||
          post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        );
      });
    },
    comments(parent, args, { db }, info) {
      if (!args.query) return db.comments;
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
    createUser(parent, args, { db }, info) {
      // check if the email is already taken
      const emailTaken = db.users.some(
        (user) => user.email === args.user.email
      );

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
      db.users.push(user);

      return user;
    },
    deleteUser(parent, args, { db }, info) {
      // check if the user exists
      const userIndex = db.users.findIndex((user) => user.id === args.id);

      // throw an error if the user isn't found
      if (userIndex === -1) throw new Error(`User not found`);

      // delete the user using the index
      const deletedUsers = db.users.splice(userIndex, 1);

      posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          db.comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });

      db.comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, { db }, info) {
      // check if the user exists
      const userExists = db.users.some((user) => user.id === args.post.author);

      if (!userExists) throw new Error(`User not found`);

      const post = {
        id: uuidv4(),
        ...args.post,
      };

      db.posts.push(post);

      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) throw new Error(`Post not found`);

      const deletedPosts = db.posts.splice(postIndex, 1);

      db.comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, args, { db }, info) {
      // check if the user exists
      const userExists = db.users.some(
        (user) => user.id === args.comment.author
      );
      const postExists = db.posts.some(
        (post) => post.id === args.comment.post && post.published === true
      );

      if (!userExists || !postExists) throw new Error(`User not found`);

      const comment = {
        id: uuidv4(),
        ...args.comment,
      };

      db.comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) throw new Error(`Comment not found`);

      const commentDeleted = db.comments.splice(commentIndex, 1);

      return commentDeleted[0];
    },
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
  },
});

server.start(() => console.log(`The server is up`));
