import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// take in the password -> validate password -> hash password -> generate auth token
// JSON Web Token (JWT)

// const token = jwt.sign({ id: 46 }, 'mysecret');
// console.log(token);

// const decoded = jwt.decode(token);
// console.log(decoded);

// const verify = jwt.verify(token, 'mysecret');
// console.log(verify);

using bcryptjs compare to check if the password is a match (one way hash, compare doesn't decrypt the hashed password)
const dummy = async () => {
  const email = `rharris@example.com`;
  const password = 'pass1234';

  const hashedPassword = `$2a$10$dJpZmRGkej6y5ap0p3UMfudUZsci9g6jE9dZMsZc.UIgbr0iY5Yiq`;

  const isMatch = await bcryptjs.compare(password, hashedPassword);
  console.log(isMatch);
};

dummy();

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
      token: jwt.sign({ userId: user.id }, 'mysecret'),
    };
  },
  async createUser(parent, args, { prisma }, info) {
    // const emailTaken = await prisma.exists.User({ email: args.data.email });

    // if (emailTaken) {
    //   throw new Error(`Email taken ${args.data.email}`);
    // }

    if (args.data.password.length < 8) {
      throw new Error(`Password must be 8 charactors or longer.`);
    }

    const password = await bcryptjs.hash(args.data.password, 10);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return { user, token: jwt.sign({ userId: user.id }, 'mysecret') };
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
