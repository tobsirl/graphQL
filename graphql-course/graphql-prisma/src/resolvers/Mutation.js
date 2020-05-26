import bcryptjs from 'bcryptjs';

import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

// take in the password -> validate password -> hash password -> generate auth token
// JSON Web Token (JWT)

// const token = jwt.sign({ id: 46 }, 'mysecret');
// console.log(token);

// const decoded = jwt.decode(token);
// console.log(decoded);

// const verify = jwt.verify(token, 'mysecret');
// console.log(verify);

// using bcryptjs compare to check if the password is a match (one way hash, compare doesn't decrypt the hashed password)
// const dummy = async () => {
//   const email = `rharris@example.com`;
//   const password = 'pass1234';

//   const hashedPassword = `$2a$10$dJpZmRGkej6y5ap0p3UMfudUZsci9g6jE9dZMsZc.UIgbr0iY5Yiq`;

//   const isMatch = await bcryptjs.compare(password, hashedPassword);
//   console.log(isMatch);
// };

// dummy();

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) throw new Error(`Unable to login`);

    const isMatch = await bcryptjs.compare(args.data.password, user.password);

    if (!isMatch) throw new Error(`Incorrect login details`);

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return { user, token: generateToken(user.id) };
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const { id, data } = args;

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    const userId = getUserId(request);

    return await prisma.mutation.updateUser(
      { where: { id: userId }, data: data },
      info
    );
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return await prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },
  async createPost(parent, args, { prisma, request }, info) {
    const { title, body, published } = args.data;

    const userId = getUserId(request);

    // get the header value, parse out the token, verify...

    return await prisma.mutation.createPost(
      {
        data: {
          title: title,
          body: body,
          published: published,
          author: { connect: { id: userId } },
        },
      },
      info
    );
  },
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    });

    const isPublished = await prisma.exists.Post({
      id: id,
      published: true,
    });

    if (!postExists) throw new Error(`Cannot update, post does not exist`);

    if (isPublished && data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: { id: id },
        },
      });
    }

    return await prisma.mutation.updatePost(
      { where: { id }, data: data },
      info
    );
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExists) throw new Error(`Unable to delete post`);

    return await prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true,
    });

    if (!postExists) throw new Error(`Post does not exist`);

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: { connect: { id: userId } },
          post: { connect: { id: args.data.post } },
        },
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!commentExists)
      throw new Error(`Cannot update, comment does not exist`);

    return prisma.mutation.updateComment({
      where: { id: args.id },
      data: args.data,
    });
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!commentExists)
      throw new Error(`Cannot delete, comment does not exist`);

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
};

export default Mutation;
