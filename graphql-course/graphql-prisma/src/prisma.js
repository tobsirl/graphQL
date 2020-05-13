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

