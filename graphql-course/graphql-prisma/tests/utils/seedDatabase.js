import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';

const seedDatabase = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  const user = await prisma.mutation.createUser({
    data: {
      name: 'Jen',
      email: 'jen@example.com',
      password: bcrypt.hashSync('thecakeisalie'),
    },
  });

  await prisma.mutation.createPost({
    data: {
      title: "Jen's post",
      body: "Body of Jen's post",
      published: true,
      author: { connect: { id: user.id } },
    },
  });

  await prisma.mutation.createPost({
    data: {
      title: "Jen's draft post",
      body: "Body of Jen's draft post",
      published: false,
      author: { connect: { id: user.id } },
    },
  });
};

export default seedDatabase;
