import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createUser(parent, args, { db }, info) {
    // check if the email is already taken
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    // throw an error if the email is taken
    if (emailTaken) {
      throw new Error(`Email taken ${args.data.email}`);
    }

    // create the user
    const user = {
      id: uuidv4(),
      ...args.data,
    };

    // save the user
    db.users.push(user);

    return user;
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;

    const user = db.users.find((user) => user.id === id);

    if (!user) throw new Error(`User not found`);

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) throw new Error(`Email already taken`);

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

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
  createPost(parent, args, { db, pubsub }, info) {
    // check if the user exists
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) throw new Error(`User not found`);

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    if (args.data.published)
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });

    db.posts.push(post);

    return post;
  },
  updatePost(parent, args, { db }, info) {
    const { id, data } = args;

    const post = db.posts.find((post) => post.id === id);

    if (!post) throw Error(`Post not found`);

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) throw new Error(`Post not found`);

    const [post] = db.posts.splice(postIndex, 1);

    db.comments.filter((comment) => comment.post !== args.id);

    if (post.published)
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      });

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    // check if the user exists
    const userExists = db.users.some((user) => user.id === args.comment.author);
    const postExists = db.posts.some(
      (post) => post.id === args.comment.post && post.published === true
    );

    if (!userExists || !postExists) throw new Error(`User not found`);

    const comment = {
      id: uuidv4(),
      ...args.comment,
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.comment.post}`, { comment });

    return comment;
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args;

    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) throw new Error(`Comment not found`);

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

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
};

export default Mutation;
