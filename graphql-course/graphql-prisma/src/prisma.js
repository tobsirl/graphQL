import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://192.168.99.100:4466/',
});

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

prisma.mutation
  .updatePost(
    {
      data: {
        body: 'Change the Body',
        published: true,
      },
      where: {
        id: 'cka5ie8pa007z0755twl8nri2',
      },
    },
    '{ id title body published }'
  )
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
    return prisma.query.posts(null, `{ id title body published}`);
  })
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  });
