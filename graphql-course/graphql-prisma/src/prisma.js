import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: `thecakeisalie`,
  fragmentReplacements,
});

export default prisma;

// prisma.query prisma.mutation prisma.subscription prisma.exists

// prisma.exists
//   .Comment({
//     id: 'cka2scb6u005h0755t7h7io03',
//   })
//   .then((exists) => {
//     console.log(exists);
//   });

// const updatePostForUser = async (postId, data) => {
//   const postExist = await prisma.exists.Post({ id: postId });

//   if (!postExist) throw new Error(`Post Id: ${postId} does not exist`);

//   const post = await prisma.mutation.updatePost(
//     {
//       data: {
//         ...data,
//       },
//       where: {
//         id: postId,
//       },
//     },
//     `{ author { id name email posts { id title published } } }`
//   );
//   return post;

// const getUser = await prisma.query.user(
//   {
//     where: {
//       id: post.author.id,
//     },
//   },
//   `{ id name email posts { id title published }}`
// );
// return getUser;
// };

// updatePostForUser('cka5ie8pa007z0755twl8nri2', {
//   title: 'test',
//   body: 'to see',
//   published: true,
// })
//   .then((user) => {
//     console.log(JSON.stringify(user, null, 2));
//   })
//   .catch((err) => console.log(err.message));

// Prisma Bindings using Async/Await
// 1. Create a new posts
// 2. Fetch all the info about the user (author)

// const createPostUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({
//     id: authorId,
//   });

//   if (!userExists) throw new Error(`User with the id: ${authorId} not found!`);

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId,
//           },
//         },
//       },
//     },
//     `{ author {id name email posts { id title published } } }`
//   );

//   return post.author;
// };

// createPostUser('cka2rmn54004h0755svx22fpq', {
//   title: 'Great books to read',
//   body: 'The Art of War',
//   published: true,
// })
//   .then((user) => {
//     console.log(JSON.stringify(user, null, 2));
//   })
//   .catch((err) => console.error(err));

// Prisma Binding Queries
// prisma.query.users(null, '{ id name email posts { id title } }').then((data) => {
//   console.log(JSON.stringify(data, null, 2));
// });

// prisma.query.comments(null, `{ id text author { id name } }`).then((data) => {
//   console.log(JSON.stringify(data, null, 2));
// });

// async function getPosts() {
//   const data = await prisma.query.posts(null, `{ id title body }`)

//   console.log(JSON.stringify(data, null, 2));
// }

// getPosts()

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: 'Promise Chaining',
//         body: 'Body of Promise Chaining',
//         published: false,
//         author: {
//           connect: {
//             id: 'cka2pfwtw00240755awi7s846',
//           },
//         },
//       },
//     },
//     '{ id title body published}'
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//     return prisma.query.users(null, `{ id name email posts { id title } }`);
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//   });

// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         body: 'Change the Body',
//         published: true,
//       },
//       where: {
//         id: 'cka5ie8pa007z0755twl8nri2',
//       },
//     },
//     '{ id title body published }'
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//     return prisma.query.posts(null, `{ id title body published}`);
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//   });
