import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://192.168.99.100:4466/',
});

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      data: {
        ...data,
      },
      where: {
        id: postId,
      },
    },
    `{ author { id } }`
  );

  const getUser = await prisma.query.user(
    {
      where: {
        id: post.author.id,
      },
    },
    `{ id name email posts { id title published }}`
  );
  return getUser;
};

updatePostForUser('cka5ifce4008d0755osksy6he', {
  title: 'test',
  body: 'to see',
  published: true,
}).then((user) => {
  console.log(JSON.stringify(user, null, 2));
});

// Prisma Bindings using Async/Await
// 1. Create a new posts
// 2. Fetch all the info about the user (author)

// const createPostUser = async (authorId, data) => {
//   const newPost = await prisma.mutation.createPost(
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
//     `{ id }`
//   );
//   const newUser = await prisma.query.user(
//     {
//       where: {
//         id: authorId,
//       },
//     },
//     `{ id name email posts { id title published }}`
//   );
//   return newUser;
// };

// createPostUser('cka2rmn54004h0755svx22fpq', {
//   title: 'Great books to read',
//   body: 'The Art of War',
//   published: true,
// }).then((user) => {
//   console.log(JSON.stringify(user, null, 2));
// });

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
