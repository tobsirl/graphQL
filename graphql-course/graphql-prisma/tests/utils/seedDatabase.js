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

const userTwo = {
  input: {
    name: 'James',
    email: 'james@example.com',
    password: bcrypt.hashSync('thecakeisalie'),
  },
  user: undefined,
  jwt: undefined,
};

const postOne = {
  input: {
    title: "Jen's post",
    body: "Body of Jen's post",
    published: true,
  },
  post: undefined,
};

const postTwo = {
  input: {
    title: "Jen's draft post",
    body: "Body of Jen's draft post",
    published: false,
  },
  post: undefined,
};

const commentOne = {
  input: {
    text: "Comment on James",
  },
  comment: undefined,
};

const commentTwo = {
  input: {
    text: "Comment on Jen",
  },
  comment: undefined,
};

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });

  // create userTwo
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  // create post one
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: { connect: { id: userOne.user.id } },
    },
  });

  // create post two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: { connect: { id: userOne.user.id } },
    },
  });

  // create comment on the published post by the first user
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userTwo.user.id,
        },
      },
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
    },
  });

  // create comment on the published post by the first user
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
    },
  });
};

export {
  seedDatabase as default,
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo,
};
