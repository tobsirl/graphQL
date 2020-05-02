import { GraphQLServer } from 'graphql-yoga';
import { users, posts, comments } from './data';
import { v4 as uuidv4 } from 'uuid';

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
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) throw new Error(`Comment not found`);

      const commentDeleted = comments.splice(commentIndex, 1);

      return commentDeleted[0];
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
  typeDefs: "./src/schema.graphql",
  resolvers,
});

server.start(() => console.log(`The server is up`));
