import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error(`Email taken ${args.data.email}`);
    }

    return await prisma.mutation.createUser({ data: args.data }, info);
  },
  async updateUser(parent, args, { prisma }, info) {
    const { id, data } = args;

    return await prisma.mutation.updateUser(
      { where: { id: id }, data: data },
      info
    );
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) throw new Error(`No user with id: ${args.id} exists`);

    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  async createPost(parent, args, { prisma }, info) {
    const { title, body, published, author } = args.data;

    return await prisma.mutation.createPost(
      {
        data: {
          title: title,
          body: body,
          published: published,
          author: { connect: { id: author } },
        },
      },
      info
    );
  },
  async updatePost(parent, args, { prisma }, info) {
    const { id, data } = args;

    return await prisma.mutation.updatePost(
      { where: { id: id }, data: data },
      info
    );
  },
  async deletePost(parent, args, { prisma }, info) {
    return await prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  async createComment(parent, args, { prisma }, info) {
    const { text, author, post } = args.data;

    return await prisma.mutation.createComment(
      {
        data: {
          text: text,
          author: { connect: { id: author } },
          post: { connect: { id: post } },
        },
      },
      info
    );
  },
  async updateComment(parent, args, { prisma }, info) {
    const { id, data } = args;

    return await prisma.mutation.updateComment({
      data: data,
      where: { id: id },
    });
  },
  async deleteComment(parent, args, { prisma }, info) {
    return await prisma.mutation.deleteComment(
      { where: { id: args.id } },
      info
    );
  },
};

export default Mutation;
