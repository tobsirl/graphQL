import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('thecakeisalie'),
  },
  user: undefined,
  jwt: undefined,
};

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  await prisma.mutation.createPost({
    data: {
      title: "Jen's post",
      body: "Body of Jen's post",
      published: true,
      author: { connect: { id: userOne.user.id } },
    },
  });

  await prisma.mutation.createPost({
    data: {
      title: "Jen's draft post",
      body: "Body of Jen's draft post",
      published: false,
      author: { connect: { id: userOne.user.id } },
    },
  });
};

export { seedDatabase as default, userOne };
